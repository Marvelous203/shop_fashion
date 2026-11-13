'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/useCart';
import type { Look } from '@/lib/data/looks';
import { showToast } from './Toast';

interface CartDrawerProps {
  isOpen: boolean;
  currentLook: Look;
  onClose: () => void;
}

export default function CartDrawer({
  isOpen,
  currentLook,
  onClose,
}: CartDrawerProps) {
  const { items, addItem, removeItem, totalItems } = useCart();

  const handleAddWholeLook = () => {
    let count = 0;
    (['tops', 'bottoms', 'full', 'shoes', 'acc'] as const).forEach((cat) => {
      const pieces = currentLook.pieces[cat] || [];
      pieces.forEach((p) => {
        const productId = `${currentLook.id}-${cat}-${p.name}`;
        addItem({
          productId,
          name: p.name,
          priceVND: p.priceVND,
          size: 'M',
          color: p.color,
          quantity: 1,
          imageFile: currentLook.imageFile,
          lookId: currentLook.id,
        });
        count++;
      });
    });

    if (count > 0) {
      showToast(`Added ${count} piece${count > 1 ? 's' : ''} to cart`);
    }
  };

  const totalUSD = items.reduce((sum, item) => {
    // Approx USD from VND or estimate
    return sum + Math.round(item.priceVND / 25000) * item.quantity;
  }, 0);

  return (
    <div
      id="cartP"
      className={`glass ${isOpen ? 'on' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="vh">
        <h3>Cart</h3>
        <span id="cartN">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      <button
        className="outl"
        id="addLook"
        style={{ height: '42px', fontSize: '14px', marginBottom: '8px' }}
        onClick={handleAddWholeLook}
      >
        Add all pieces of this look
      </button>

      <div id="cartL">
        {items.length === 0 ? (
          <div className="empty">Your cart is empty.</div>
        ) : (
          items.map((item, idx) => {
            const usdPrice = Math.round(item.priceVND / 25000);
            return (
              <div key={`${item.productId}-${idx}`} className="ci">
                <span className="in">
                  {item.name}
                  <small>
                    {item.color} · Size {item.size} (x{item.quantity})
                  </small>
                </span>
                <b>${usdPrice * item.quantity}</b>
                <button
                  aria-label="Remove item"
                  onClick={() =>
                    removeItem(item.productId, item.size, item.color)
                  }
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="tot">
        <span>Total</span>
        <b id="cartT">${totalUSD}</b>
      </div>

      <Link
        href="/cart"
        className="outl solid"
        id="checkout"
        style={{
          display: 'grid',
          placeItems: 'center',
          textDecoration: 'none',
        }}
        onClick={onClose}
      >
        Checkout
      </Link>
    </div>
  );
}
