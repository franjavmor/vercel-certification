"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductDetailsToolInvocation } from "@/lib/agent";

interface AgentProductCardProps {
    invocation: ProductDetailsToolInvocation;
}

export function AgentProductCard({ invocation }: AgentProductCardProps) {
    if (
        invocation.state === "input-streaming" ||
        invocation.state === "input-available"
    ) {
        const id = invocation.input?.idOrSlug;
        return (
            <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
            Looking up{id ? ` "${id}"` : ""}…
            </div>
        );
    }
    
    if (invocation.state !== "output-available") return null;
    
    const output = invocation.output;
    
    if (!output) return null;
    
    if ("error" in output) {
        return (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {output.error as string}
            </div>
        );
    }
    
    const image = output.images[0];
    const { inStock, lowStock, available } = output.stock;

    const stockLabel = !inStock
    ? "Out of stock"
    : lowStock
    ? `Only ${available} left`
    : "In stock";

    const stockClass = !inStock
    ? "bg-destructive/10 text-destructive"
    : lowStock
    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    : "bg-secondary text-muted-foreground";
    
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
        {image && (
            <div className="relative aspect-4/3 bg-secondary">
                <Image
                src={image}
                alt={output.name}
                fill
                sizes="(min-width: 768px) 480px, 100vw"
                className="object-cover"
                />
            </div>
            )}
            <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold leading-tight">
                            {output.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {formatPrice(output.price, output.currency)}
                        </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${stockClass}`}>
                        {stockLabel} 
                    </span>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                    {output.description}
                </p>
                {output.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {output.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        {tag}
                    </span>
                ))}
                </div>
            )}
                <Link href={`/products/${output.slug}`} className="inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline" >
                    View product →
                </Link>
            </div>
        </div>
    );
}