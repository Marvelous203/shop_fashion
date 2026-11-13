'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LOOKS, type PieceItem } from '@/lib/data/looks';
import { FILTERS } from '@/lib/data/filters';
import { useStudio } from '@/lib/hooks/useStudio';
import { useCart } from '@/lib/hooks/useCart';

import Scene from './Scene';
import ModelViewer from './ModelViewer';
import TopBar, { type TabKey } from './TopBar';
import ProfileCard from './ProfileCard';
import StyleMenu, { type StyleSectionKey } from './StyleMenu';
import OutfitsPanel from './OutfitsPanel';
import TunePanel from './TunePanel';
import DnaPanel from './DnaPanel';
import BodyPanel from './BodyPanel';
import PersonalityPanel from './PersonalityPanel';
import StoryPanel from './StoryPanel';
import ControlBar from './ControlBar';
import RealismSlider from './RealismSlider';
import FilterPanel from './FilterPanel';
import SaveButton from './SaveButton';
import LibraryDrawer from './LibraryDrawer';
import CartDrawer from './CartDrawer';
import Toast, { showToast } from './Toast';

export default function StudioClient() {
  const {
    state,
    update,
    undo,
    redo,
    canUndo,
    canRedo,
    resetAll,
    setParallax,
    currentIdentity,
    setCustomName,
    nextIdentity,
    favorites,
    toggleFavorite,
    isCurrentFavorite,
    savedLibrary,
    saveToLibrary,
    isCartOpen,
    setIsCartOpen,
    isLibraryOpen,
    setIsLibraryOpen,
    isMoreOpen,
    setIsMoreOpen,
  } = useStudio();

  const { items: cartItems, addItem, removeItem } = useCart();

  // Stage scaling
  const [stageScale, setStageScale] = useState(1);
  const [scanTrigger, setScanTrigger] = useState(0);

  // Accordion active row in Outfits panel
  const [openAccordionRow, setOpenAccordionRow] = useState<
    'tops' | 'bottoms' | 'full' | 'shoes' | 'acc' | null
  >(null);

  // Scale computation
  useEffect(() => {
    const handleResize = () => {
      const s = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
      setStageScale(s);
      document.documentElement.style.setProperty('--s', String(s));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Parallax handling
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      const bx = -x * 22;
      const by = -y * 12;
      const mx = x * 10;
      setParallax(bx, by, mx);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [setParallax]);

  // Click outside to close menus/drawers
  const handleStageClick = () => {
    if (isMoreOpen) setIsMoreOpen(false);
    if (isLibraryOpen) setIsLibraryOpen(false);
    if (isCartOpen) setIsCartOpen(false);
  };

  const currentLook = LOOKS[state.lookId] || LOOKS[0];
  const currentFilter =
    FILTERS.find((f) => f.id === state.gradeId) || FILTERS[0];

  const triggerRescan = useCallback(() => {
    setScanTrigger((prev) => prev + 1);
  }, []);

  // Tab change
  const handleTabChange = (tab: TabKey) => {
    update({ activeTab: tab });
    if (tab === 'BODY') {
      update({ activeSideItem: 'body' });
    }
  };

  // Side item selection
  const handleSelectSideSection = (key: StyleSectionKey) => {
    update({ activeSideItem: key, activeTab: 'STYLE' });
  };

  // Hotspot click in Full model view
  const handleHotspotSelectCategory = (
    cat: 'tops' | 'bottoms' | 'full' | 'shoes' | 'acc'
  ) => {
    update({ activeTab: 'STYLE', activeSideItem: 'outfits' });
    setOpenAccordionRow(cat);
  };

  // Randomize full VELL
  const handleRandomize = () => {
    const nextLook = Math.floor(Math.random() * LOOKS.length);
    const nextGrade =
      FILTERS[Math.floor(Math.random() * FILTERS.length)].id;
    const nextReal = 55 + Math.floor(Math.random() * 45);
    const nextHeight = 155 + Math.floor(Math.random() * 25);
    const nextBuild = 30 + Math.floor(Math.random() * 45);

    update({
      lookId: nextLook,
      gradeId: nextGrade,
      realism: nextReal,
      height: nextHeight,
      build: nextBuild,
    });
    triggerRescan();
    showToast('Randomized VELL');
  };

  // Pose / Framing cycling
  const handleCycleFraming = () => {
    const nextFraming: Record<'full' | 'mid' | 'portrait', 'full' | 'mid' | 'portrait'> = {
      full: 'mid',
      mid: 'portrait',
      portrait: 'full',
    };
    update({ framing: nextFraming[state.framing] });
  };

  // Reset all
  const handleReset = () => {
    resetAll();
    showToast('Reset to default');
    triggerRescan();
  };

  // Cart operations
  const cartItemIds = useMemo(() => {
    return new Set(cartItems.map((i) => i.productId));
  }, [cartItems]);

  const handleToggleCartItem = (
    piece: PieceItem,
    cat: string,
    lookId: number
  ) => {
    const productId = `${lookId}-${cat}-${piece.name}`;
    if (cartItemIds.has(productId)) {
      removeItem(productId, 'M', piece.color);
      showToast('Removed from cart');
    } else {
      addItem({
        productId,
        name: piece.name,
        priceVND: piece.priceVND,
        size: 'M',
        color: piece.color,
        quantity: 1,
        imageFile: LOOKS[lookId].imageFile,
        lookId,
      });
      showToast('Added to cart');
    }
  };

  // Active view in right panel
  const renderRightPanelContent = () => {
    const isStyle = state.activeTab === 'STYLE';
    const sideItem = state.activeSideItem.toLowerCase();

    if (isStyle) {
      if (sideItem === 'outfits') {
        return (
          <OutfitsPanel
            looks={LOOKS}
            currentLookId={state.lookId}
            onSelectLook={(id) => {
              update({ lookId: id });
              triggerRescan();
            }}
            favorites={favorites}
            onToggleFavorite={(id) => {
              toggleFavorite(id);
              showToast(
                favorites.has(id)
                  ? 'Removed from favourites'
                  : 'Added to favourites'
              );
            }}
            openCategory={openAccordionRow}
            onToggleCategory={(cat) =>
              setOpenAccordionRow((prev) => (prev === cat ? null : cat))
            }
            cartItemIds={cartItemIds}
            onToggleCartItem={handleToggleCartItem}
          />
        );
      }
      if (sideItem === 'body') {
        return (
          <BodyPanel
            height={state.height}
            build={state.build}
            framing={state.framing}
            onHeightChange={(h, commit) => update({ height: h }, commit)}
            onBuildChange={(b, commit) => update({ build: b }, commit)}
            onFramingChange={(f) => update({ framing: f })}
            onRescan={triggerRescan}
          />
        );
      }
      return (
        <TunePanel
          sectionKey={state.activeSideItem}
          onRescan={triggerRescan}
        />
      );
    }

    switch (state.activeTab) {
      case 'DNA':
        return (
          <DnaPanel
            identity={currentIdentity}
            onReseed={() => {
              nextIdentity();
              triggerRescan();
            }}
          />
        );
      case 'BODY':
        return (
          <BodyPanel
            height={state.height}
            build={state.build}
            framing={state.framing}
            onHeightChange={(h, commit) => update({ height: h }, commit)}
            onBuildChange={(b, commit) => update({ build: b }, commit)}
            onFramingChange={(f) => update({ framing: f })}
            onRescan={triggerRescan}
          />
        );
      case 'PERSONALITY':
        return <PersonalityPanel />;
      case 'STORY':
        return (
          <StoryPanel
            currentLook={currentLook}
            identity={currentIdentity}
            height={state.height}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
      onClick={handleStageClick}
    >
      {/* Background & Lighting Scene */}
      <Scene
        gradeFilter={currentFilter.gradeFilter}
        tintBackground={currentFilter.tintBackground}
        bx={state.bx}
        by={state.by}
        realism={state.realism}
      />

      {/* Main 1600x900 Stage */}
      <div
        id="stage"
        style={{
          transform: `translate(-50%, -50%) scale(${stageScale})`,
        }}
      >
        {/* Model Avatar Viewer */}
        <ModelViewer
          looks={LOOKS}
          currentLookId={state.lookId}
          mx={state.mx}
          height={state.height}
          build={state.build}
          framing={state.framing}
          realism={state.realism}
          scanTrigger={scanTrigger}
          onSelectCategory={handleHotspotSelectCategory}
        />

        {/* Top Navigation & Header */}
        <TopBar
          activeTab={state.activeTab}
          onTabChange={handleTabChange}
          cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
          onToggleCart={() => setIsCartOpen((prev) => !prev)}
          favCount={favorites.size}
          isCurrentFav={isCurrentFavorite}
          onToggleFav={() => {
            toggleFavorite(state.lookId);
            showToast(
              favorites.has(state.lookId)
                ? 'Removed from favourites'
                : 'Added to favourites'
            );
          }}
          savedCount={savedLibrary.length}
          onToggleLib={() => setIsLibraryOpen((prev) => !prev)}
          isMoreOpen={isMoreOpen}
          setIsMoreOpen={setIsMoreOpen}
        />

        {/* Character Profile Card */}
        <ProfileCard
          currentLook={currentLook}
          identity={currentIdentity}
          onShuffle={nextIdentity}
          onNameChange={setCustomName}
        />

        {/* Left Side Category Menu & Randomize */}
        <StyleMenu
          activeSection={state.activeSideItem}
          onSelectSection={handleSelectSideSection}
          onRandomize={handleRandomize}
          isStyleTab={state.activeTab === 'STYLE'}
        />

        {/* Right Configuration Panel */}
        <div id="panel" className="glass">
          <section className="view on">{renderRightPanelContent()}</section>
        </div>

        {/* Cart Drawer Popup */}
        <CartDrawer
          isOpen={isCartOpen}
          currentLook={currentLook}
          onClose={() => setIsCartOpen(false)}
        />

        {/* Library Drawer Popup */}
        <LibraryDrawer
          isOpen={isLibraryOpen}
          savedLooks={savedLibrary}
          looks={LOOKS}
          onSelectSaved={(lookId, gradeId) => {
            update({ lookId, gradeId });
            triggerRescan();
            setIsLibraryOpen(false);
          }}
        />

        {/* Bottom Studio Controls */}
        <ControlBar
          canUndo={canUndo}
          canRedo={canRedo}
          framing={state.framing}
          onUndo={undo}
          onRedo={redo}
          onCycleFraming={handleCycleFraming}
          onReset={handleReset}
        />

        {/* Realism Slider Control */}
        <RealismSlider
          realism={state.realism}
          onRealismChange={(r, commit) => update({ realism: r }, commit)}
          onRescan={triggerRescan}
        />

        {/* Filter Palette Control */}
        <FilterPanel
          currentLook={currentLook}
          currentGradeId={state.gradeId}
          onSelectGradeId={(g) => update({ gradeId: g })}
        />

        {/* Save to Library Action */}
        <SaveButton
          onSave={() => {
            saveToLibrary();
            setIsLibraryOpen(true);
          }}
        />

        {/* Floating Notification Toast */}
        <Toast />
      </div>
    </div>
  );
}
