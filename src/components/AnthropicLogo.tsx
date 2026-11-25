interface AnthropicLogoProps {
  className?: string;
}

export default function AnthropicLogo({ className = "h-6 w-6" }: AnthropicLogoProps) {
  return (
    <svg
      viewBox="0 0 256 176"
      fill="currentColor"
      className={className}
      aria-label="Anthropic logo"
    >
      <path d="M147.487 0L256 176h-45.32l-21.063-34.787H131.26L147.487 0Zm-8.027 46.513L108.5 110.4h61.916l-30.956-63.887ZM89.333 0L0 176h45.32l21.063-34.787h58.357L89.333 0Zm8.027 46.513l30.96 63.887H66.404l30.956-63.887Z" />
    </svg>
  );
}
