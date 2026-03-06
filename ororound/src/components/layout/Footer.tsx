import Link from 'next/link';
import { Github, FileText, Globe, Sparkles } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

const footerLinks: FooterLink[] = [
  {
    label: 'Docs',
    href: 'https://docs.ororound.com',
    icon: <FileText className="h-4 w-4" />,
    external: true,
  },
  {
    label: 'Oro Website',
    href: 'https://oro.finance',
    icon: <Globe className="h-4 w-4" />,
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/oro/ororound',
    icon: <Github className="h-4 w-4" />,
    external: true,
  },
];

const version = '0.1.0';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50/50 px-3 py-1.5 dark:bg-amber-950/20">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Powered by oro.finance
              </span>
            </div>

            <span className="text-xs text-muted-foreground">v{version}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
