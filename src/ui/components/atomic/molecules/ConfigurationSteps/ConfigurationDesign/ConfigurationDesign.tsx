'use client';

const ConfigurationDesign = () => {
  return (
    <>
      {/* <Flex variant="step_design">
      <Grid variant="select_parts">
        <Button variant="select_none" title="Nessuno" data-active={activePattern === null} onClick={() => setActivePattern(null)}>
          <SvgIcon name="none" />
          Nessuno
        </Button>
        {patterns.map((pattern, index) => (
          <Button
            key={pattern.key}
            variant="select_part"
            className="transition-none will-change-auto"
            title={pattern.name}
            data-active={pattern.key === activePatternKey}
            onClick={() => setActivePattern(pattern.key)}
            style={{ contentVisibility: 'auto', contain: 'layout paint style' }}
          >
            <>
              {pattern.map((pattern.part, index) => (
                <AtomImage
                  key={part.key}
                  src={part.src}
                  alt=""
                  width={80}
                  height={80}
                  loading={eager ? 'eager' : 'lazy'}
                  fetchPriority={eager ? 'high' : 'low'}
                  className={cn('w-full h-full object-cover', index > 0 && 'absolute inset-0')}
                  draggable={false}
                />
              ))}
            </>
          </Button>
        ))}
      </Grid>
      {activePattern && activePattern.parts.length === 1 && (
        <ColorControl
          color={getPartColor(activePattern.parts[0].key)}
          onSelect={(color) => handleCommit(activePattern.parts[0].key, color)}
          onPreviewSelect={(color) => handlePreview(activePattern.parts[0].key, color)}
          label="Colore design"
        />
      )}
      {activePattern && activePattern.parts.length === 2 && (
        <ColorTabControl
          textColor={getPartColor(activePattern.parts[0].key)}
          strokeColor={getPartColor(activePattern.parts[1].key)}
          onTextColor={(color) => handleCommit(activePattern.parts[0].key, color)}
          onStrokeColor={(color) => handleCommit(activePattern.parts[1].key, color)}
          onPreviewTextColor={(color) => handlePreview(activePattern.parts[0].key, color)}
          onPreviewStrokeColor={(color) => handlePreview(activePattern.parts[1].key, color)}
          label="Colore design"
        />
      )} 

e={Math.round((activeCustomization?.opacity ?? 1) * 100)}
          onChange={(value) => setOpacityPreview(value / 100)}
          onCommit={() => {
            const opacity = useGarmentDesignPreview.getState().opacityPreview;
            clearOpacityPreview();
            if (opacity !== null) setPatternOpacity(opacity);
          }}
          min={0}
          max={100}
          unit="%"
          label="Trasparenza"
        />
      )}
    </Flex> */}
    </>
  );
};

export { ConfigurationDesign };
