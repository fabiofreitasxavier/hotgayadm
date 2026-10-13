import { Fragment } from "react";
import type { Video } from "@/data/catalog";
import { VideoCard } from "@/components/video-card";
import { PromoBanner, PromoTile } from "@/components/promo";

/**
 * Videos per block. Each block is these videos plus one promo tile = 24 grid cells, which fills
 * whole rows at 2, 3 and 4 columns, so the banner between blocks never leaves a half-empty row.
 */
const BLOCK = 23;
/** Where the promo tile sits inside each block (end of the first row on desktop). */
const TILE_SLOT = 3;

/**
 * Dense tube-style grid: 2 columns on phones up to 4 on desktop, with a Telegram promo
 * tile in each block of videos and a full-width banner between blocks.
 */
export function VideoGrid({ videos, promos = true }: { videos: Video[]; promos?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
      {videos.map((video, i) => {
        const block = Math.floor(i / BLOCK);
        const slot = i % BLOCK;
        return (
          <Fragment key={video.id}>
            {promos && slot === 0 && block > 0 ? (
              <PromoBanner variant={block} className="col-span-full" />
            ) : null}
            {promos && slot === TILE_SLOT ? <PromoTile variant={block + 1} /> : null}
            <VideoCard video={video} />
          </Fragment>
        );
      })}
    </div>
  );
}
