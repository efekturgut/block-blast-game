import Block from "./Block";
getra
const BlockTray = ({ blocks }) => {
  return (
    <div className="block-tray">
      {blocks.map((block) => (
        <Block key={block.instanceId} block={block} />
      ))}
    </div>
  );
};

export default BlockTray;