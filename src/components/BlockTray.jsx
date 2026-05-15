import Block from "./Block";

const BlockTray = ({ blocks }) => {
  return (
    <div className="block-tray">
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
};

export default BlockTray;