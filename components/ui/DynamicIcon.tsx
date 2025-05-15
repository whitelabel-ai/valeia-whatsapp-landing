"use client";

import dynamic from "next/dynamic";
import { IconProps } from "../Features";

interface DynamicIconProps extends IconProps {
  iconName: string | null;
}

export const DynamicIcon = ({
  iconName,
  size = 48,
  className = "text-primary"
}: DynamicIconProps) => {
  if (!iconName) return null;

  const IconComponent = dynamic<IconProps>(
    () =>
      import("lucide-react").then((mod) => {
        const Component = mod[iconName as keyof typeof mod] as
          | React.ComponentType<IconProps>
          | undefined;

        if (!Component) return { default: () => null };

        return { default: Component };
      }).catch(() => {
        return { default: () => null };
      }),
    {
      ssr: false,
      loading: () => null
    }
  );

  return <IconComponent size={size} className={className} />;
};