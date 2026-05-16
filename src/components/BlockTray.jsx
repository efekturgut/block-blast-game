import Block from "./Block";

const BlockTray = ({ blocks, onTouchDrop }) => {
  return (
    <div className="block-tray">
      {blocks.map((block) => (
        <Block
          key={block.instanceId || block.id}
          block={block}
          onTouchDrop={onTouchDrop}
        />
      ))}
    </div>
  );
};

export default BlockTray;