import { Components } from "react-markdown";
import { cn } from "@/lib/utils";

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
  return inline ? (
    <code
      className={cn(
        "bg-muted px-1.5 py-0.5 rounded text-sm font-mono",
        className
      )}
      {...props}
    >
      {children}
    </code>
  ) : (
    <pre
      className={cn("bg-muted p-4 rounded-lg my-4 overflow-x-auto", className)}
      {...props}
    >
      <code className="text-sm font-mono">{children}</code>
    </pre>
  );
};

export const defaultMarkdownComponents: Components = {
  // Párrafos y texto
  p: ({ className, ...props }) => (
    <p
      className={cn("text-base md:text-lg text-foreground/80 mb-4", className)}
      {...props}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-bold text-foreground", className)} {...props} />
  ),
  em: ({ className, ...props }) => (
    <em className={cn("italic text-foreground/90", className)} {...props} />
  ),

  // Encabezados
  h1: ({ className, ...props }) => (
    <h1
      className={cn("text-3xl font-bold mb-6 text-foreground", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn("text-2xl font-bold mb-4 text-foreground", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn("text-xl font-bold mb-3 text-foreground", className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn("text-lg font-bold mb-2 text-foreground", className)}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn("text-base font-bold mb-2 text-foreground", className)}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn("text-sm font-bold mb-2 text-foreground", className)}
      {...props}
    />
  ),

  // Enlaces
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "text-primary hover:underline transition-colors",
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),

  // Listas
  ul: ({ className, ...props }) => (
    <ul className={cn("list-disc pl-6 mb-4 space-y-2", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn("list-decimal pl-6 mb-4 space-y-2", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("text-foreground/80", className)} {...props} />
  ),

  // Bloques de código y citas
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "border-l-4 border-primary pl-4 italic my-6 text-foreground/80",
        className
      )}
      {...props}
    />
  ),
  code: CodeBlock,
  pre: ({ className, ...props }) => (
    <pre
      className={cn("bg-muted p-4 rounded-lg my-4 overflow-x-auto", className)}
      {...props}
    />
  ),

  // Elementos de tabla
  table: ({ className, ...props }) => (
    <div className="overflow-x-auto my-6">
      <table className={cn("w-full border-collapse", className)} {...props} />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={cn("bg-muted", className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("border-b border-border", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th className={cn("px-4 py-2 text-left font-bold", className)} {...props} />
  ),
  td: ({ className, ...props }) => (
    <td className={cn("px-4 py-2", className)} {...props} />
  ),

  // Elementos horizontales y de formato
  hr: ({ className, ...props }) => (
    <hr className={cn("my-8 border-border", className)} {...props} />
  ),
  br: () => <br />,
  img: ({ className, alt, ...props }) => (
    <img
      className={cn("rounded-lg max-w-full h-auto my-4", className)}
      alt={alt || ""}
      loading="lazy"
      {...props}
    />
  ),

  // Elementos de detalle
  details: ({ className, ...props }) => (
    <details className={cn("my-4", className)} {...props} />
  ),
  summary: ({ className, ...props }) => (
    <summary
      className={cn("cursor-pointer font-semibold", className)}
      {...props}
    />
  ),

  // Elementos de subíndice y superíndice
  sub: ({ className, ...props }) => (
    <sub className={cn("text-sm", className)} {...props} />
  ),
  sup: ({ className, ...props }) => (
    <sup className={cn("text-sm", className)} {...props} />
  ),
};

// Función para combinar componentes personalizados con los predeterminados
export function mergeMarkdownComponents(
  customComponents: Partial<Components> = {}
): Components {
  return {
    ...defaultMarkdownComponents,
    ...customComponents,
  };
}
