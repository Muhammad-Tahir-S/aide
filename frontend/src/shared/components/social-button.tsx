import SocialIcon from "../assets/icons/google-social-icon.svg?react";
import { Button } from "./ui/button";

export default function SocialButton({ buttonText }: { buttonText: string }) {
  return (
    <Button className="h-11 bg-transparent text-gray-700 border-gray-300 border-[2px] hover:bg-primary-50 hover:border-primary-50 focus:border-primary-400 focus:bg-transparent">
      <SocialIcon />
      {buttonText}
    </Button>
  );
}
