'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/useCart';
import { CartItem } from '@/components/shop/CartItem';
import { CartSummary } from '@/components/shop/CartSummary';
import { CheckoutForm, type CheckoutFormData } from '@/components/shop/CheckoutForm';
import { PaymentMethods, type PaymentMethodType } from '@/components/shop/PaymentMethods';
import { estimateShipping, formatVND } from '@/lib/utils/format';

interface OrderConfirmation {
  orderId: string;
  customerName: string;
  phone: string;
  shippingAddress: string;
  totalVND: number;
  paymentMethod: string;
  paymentUrl?: string;
  itemsCount: number;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalVND } = useCart();

  const [province, setProvince] = useState('Hà Nội');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('cod');

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    address: '',
    province: 'Hà Nội',
    note: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);

  // Sync province
  const handleProvinceChange = (newProvince: string) => {
    setProvince(newProvince);
    setFormData((prev) => ({ ...prev, province: newProvince }));
  };

  const handleFormChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleApplyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'VELL10') {
      setAppliedCoupon('VELL10');
      setDiscountPercent(10);
      return { success: true, message: 'Áp dụng mã VELL10 thành công! Bạn được giảm 10%.' };
    }
    return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
    setCouponCode('');
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CheckoutFormData, string>> = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên';
    }
    const vnPhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!vnPhoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không đúng định dạng Việt Nam';
    }
    if (!formData.address.trim()) {
      errors.address = 'Vui lòng nhập địa chỉ cụ thể';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const shipping = estimateShipping(totalVND, province);
    const discountAmount = Math.round(totalVND * (discountPercent / 100));
    const finalTotal = Math.max(0, totalVND - discountAmount + shipping);

    const orderPayload = {
      customerName: formData.fullName,
      phone: formData.phone,
      shippingAddress: `${formData.address}, ${formData.province}`,
      province: formData.province,
      note: formData.note,
      paymentMethod: selectedMethod,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        priceVND: i.priceVND,
      })),
      subtotal: totalVND,
      discount: discountAmount,
      shippingFee: shipping,
      totalVND: finalTotal,
      couponCode: appliedCoupon || undefined,
    };

    try {
      // POST to backend orders API
      let orderId = `VEL-${Date.now().toString().slice(-6)}`;
      let paymentUrl: string | undefined;

      try {
        const response = await fetch('http://localhost:3001/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        if (response.ok) {
          const data = await response.json();
          orderId = data.id || data.orderId || orderId;
          paymentUrl = data.paymentUrl;
        }
      } catch (e) {
        // Fallback for offline backend demo
        console.warn('Backend orders API unreachable, simulating successful local order', e);
      }

      setOrderConfirmation({
        orderId,
        customerName: formData.fullName,
        phone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.province}`,
        totalVND: finalTotal,
        paymentMethod: selectedMethod,
        paymentUrl,
        itemsCount: items.length,
      });

      clearCart();
    } catch (err) {
      console.error('Order error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shipping = estimateShipping(totalVND, province);
  const discountAmount = Math.round(totalVND * (discountPercent / 100));
  const finalTotal = Math.max(0, totalVND - discountAmount + shipping);

  // If order confirmation is active
  if (orderConfirmation) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
        <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-black tracking-widest uppercase font-serif">
              VELL
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Cảm ơn bạn đã lựa chọn VELL. Đơn hàng của bạn đang được xử lý và chuẩn bị giao.
          </p>

          <div className="w-full mt-8 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-left space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Mã đơn hàng
              </span>
              <span className="font-mono font-bold text-base text-neutral-900 dark:text-white">
                #{orderConfirmation.orderId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-neutral-400">Người nhận:</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {orderConfirmation.customerName}
                </p>
              </div>
              <div>
                <p className="text-neutral-400">Số điện thoại:</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {orderConfirmation.phone}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-neutral-400">Địa chỉ giao hàng:</p>
                <p className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {orderConfirmation.shippingAddress}
                </p>
              </div>
              <div>
                <p className="text-neutral-400">Hình thức thanh toán:</p>
                <p className="font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {orderConfirmation.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-neutral-400">Tổng thanh toán:</p>
                <p className="font-bold text-base text-neutral-900 dark:text-white mt-0.5">
                  {formatVND(orderConfirmation.totalVND)}
                </p>
              </div>
            </div>

            {/* QR Payment notice if QR method */}
            {orderConfirmation.paymentMethod === 'qr' && (
              <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-2 text-center">
                <p className="font-semibold">Vui lòng quét mã VietQR để hoàn tất thanh toán:</p>
                <div className="flex justify-center py-2">
                  <div className="p-2 bg-white rounded-xl shadow-xs">
                    <img
                      src={`https://img.vietqr.io/image/MB-1234567890-compact.png?amount=${orderConfirmation.totalVND}&addInfo=VELL%20${orderConfirmation.orderId}`}
                      alt="VietQR MB Bank"
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-blue-700 dark:text-blue-300">
                  MB Bank • STK: <strong>1234567890</strong> • Chủ TK: <strong>VELL FASHION</strong>
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <Link
              href="/shop"
              className="px-6 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition shadow-sm"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
            >
              Về Phòng Thử Đồ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-black tracking-widest uppercase font-serif">
              VELL
            </Link>
            <Link href="/shop" className="text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-black">
              Bộ Sưu Tập (Shop)
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 mb-4 border border-neutral-200 dark:border-neutral-800">
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold font-serif">Giỏ hàng trống</h2>
          <p className="text-xs text-neutral-500 max-w-sm mt-1 mb-6">
            Bạn chưa chọn món đồ nào vào giỏ. Hãy ghé qua cửa hàng để tìm trang phục phù hợp với phong cách của bạn.
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition shadow-sm"
          >
            Khám phá bộ sưu tập ngay
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-black tracking-widest uppercase font-serif">
              VELL
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              <Link href="/" className="hover:text-black dark:hover:text-white transition">
                Phòng Thử Đồ (Studio)
              </Link>
              <Link href="/shop" className="hover:text-black dark:hover:text-white transition">
                Bộ Sưu Tập (Shop)
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 font-medium">
              Giỏ hàng ({items.length} món)
            </span>
          </div>
        </div>
      </header>

      {/* Main Checkout Page */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white">
            Giỏ Hàng & Thanh Toán
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Vui lòng kiểm tra lại sản phẩm và điền thông tin giao hàng bên dưới.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Cart Items & Checkout Form & Payment Methods */}
          <div className="lg:col-span-7 space-y-8">
            {/* Cart Items Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Sản phẩm đã chọn ({items.length})
                </h2>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-neutral-400 hover:text-red-500 transition"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {items.map((item) => (
                  <CartItem
                    key={`${item.productId}-${item.size}-${item.color}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* Address Form Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs">
              <CheckoutForm
                formData={formData}
                onChange={handleFormChange}
                errors={formErrors}
              />
            </div>

            {/* Payment Methods Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs">
              <PaymentMethods
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
              />

              {/* QR Code details preview if QR selected */}
              {selectedMethod === 'qr' && (
                <div className="mt-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-xs space-y-2">
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Thông tin tài khoản nhận chuyển khoản:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                    <div>Ngân hàng: <strong>MB Bank (Quân Đội)</strong></div>
                    <div>Số tài khoản: <strong className="font-mono text-neutral-900 dark:text-white">1234567890</strong></div>
                    <div>Chủ tài khoản: <strong>VELL FASHION VIETNAM</strong></div>
                    <div>Nội dung: <strong>VELL + SĐT của bạn</strong></div>
                  </div>
                  <p className="text-[10px] text-neutral-400 italic">
                    * Mã QR động sẽ được tạo tự động sau khi bạn bấm Xác nhận đặt hàng.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Action */}
          <div className="lg:col-span-5 space-y-6">
            <CartSummary
              subtotal={totalVND}
              province={province}
              onProvinceChange={handleProvinceChange}
              couponCode={couponCode}
              onApplyCoupon={handleApplyCoupon}
              discountPercent={discountPercent}
              appliedCoupon={appliedCoupon || undefined}
              onRemoveCoupon={handleRemoveCoupon}
            />

            {/* Checkout CTA */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold uppercase tracking-wider text-xs transition duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang xử lý đơn hàng...</span>
                  </>
                ) : selectedMethod === 'vnpay' || selectedMethod === 'momo' || selectedMethod === 'zalopay' ? (
                  `Chuyển đến thanh toán qua ${selectedMethod.toUpperCase()} (${formatVND(finalTotal)})`
                ) : (
                  `Xác nhận đặt hàng (${formatVND(finalTotal)})`
                )}
              </button>

              <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/50 text-[11px] text-neutral-500 space-y-1">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Bảo mật thanh toán 100% chuẩn SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📦</span>
                  <span>Kiểm tra hàng trước khi thanh toán đối với COD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 text-center text-xs text-neutral-500 mt-12">
        <p>© 2026 VELL Fashion Studio & Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}
