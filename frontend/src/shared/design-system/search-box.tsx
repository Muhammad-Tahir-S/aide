import { Command, CommandInput } from "./command";

export default function SearchBox() {
  return (
    <Command className="h-13">
      <CommandInput placeholder="Search" />
    </Command>
  );
}
