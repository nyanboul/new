export default function DummyImage({ color = "#6C3CE1" }: { color?: string }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: color }}
    />
  );
} 