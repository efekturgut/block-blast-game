import Block from "./Block";

const BlockTray = ({ blocks, selectedBlock, onSelectBlock }) => {
  return (
    <div className="block-tray">
      {blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          isSelected={selectedBlock?.id === block.id}
          onSelect={onSelectBlock}
        />
      ))}
    </div>
  );
};

export default BlockTray;