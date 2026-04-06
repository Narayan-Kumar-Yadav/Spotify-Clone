import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    />
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 10.75 12 3l9 7.75" />
      <path d="M5.5 9.5V20h13V9.5" />
    </BaseIcon>
  );
}

export function LibraryIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 4.5h2.5V19H5z" />
      <path d="M10.75 4.5h2.5V19h-2.5z" />
      <path d="M16.5 4.5h2.5V19h-2.5z" />
    </BaseIcon>
  );
}

export function MusicNoteIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 18.25a2.75 2.75 0 1 1-2.75-2.75A2.75 2.75 0 0 1 9 18.25Z" />
      <path d="M18 16.25a2.75 2.75 0 1 1-2.75-2.75A2.75 2.75 0 0 1 18 16.25Z" />
      <path d="M9 18.25V7.5l9-2.5v11.25" />
    </BaseIcon>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m8.5 6.75 8 5.25-8 5.25Z" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 7h2.5v10H9z" fill="currentColor" stroke="none" />
      <path d="M12.5 7H15v10h-2.5z" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="6.25" />
      <path d="m20 20-4.25-4.25" />
    </BaseIcon>
  );
}

export function SkipBackIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 6.75v10.5" />
      <path d="m16.75 7.25-7 4.75 7 4.75Z" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function SkipForwardIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M17 6.75v10.5" />
      <path d="m7.25 7.25 7 4.75-7 4.75Z" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </BaseIcon>
  );
}

export function SpeakerIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 14h3.5L13 18V6L8.5 10H5z" />
      <path d="M16.5 9.25a4.25 4.25 0 0 1 0 5.5" />
      <path d="M18.75 6.75a7.5 7.5 0 0 1 0 10.5" />
    </BaseIcon>
  );
}

export function StackIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m12 4 8 4.25-8 4.25L4 8.25Z" />
      <path d="m4 12.25 8 4.25 8-4.25" />
      <path d="m4 16.25 8 4.25 8-4.25" />
    </BaseIcon>
  );
}

export function WaveformIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 13.5h1.5V10H4z" fill="currentColor" stroke="none" />
      <path d="M7.5 17h1.5V7H7.5z" fill="currentColor" stroke="none" />
      <path d="M11 20h1.5V4H11z" fill="currentColor" stroke="none" />
      <path d="M14.5 17h1.5V7h-1.5z" fill="currentColor" stroke="none" />
      <path d="M18 13.5h1.5V10H18z" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 20.25s-7-4.75-7-10a4.25 4.25 0 0 1 7-3.2 4.25 4.25 0 0 1 7 3.2c0 5.25-7 10-7 10Z" />
    </BaseIcon>
  );
}
