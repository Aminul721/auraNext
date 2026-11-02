import Image from "next/image";
import { Icon } from "@/components/Icons";

export type RoboticsVideoSource =
  | { type: "local"; src: string }
  | { type: "embed"; src: string; title: string };

export function RoboticsVideo({
  source,
}: {
  source?: RoboticsVideoSource;
}) {
  return (
    <section className="robotics-video-section" aria-labelledby="robotics-video-title">
      <div className="section-header center">
        <h2 className="section-title" id="robotics-video-title">
          Experience the Future of Humanoid Robotics
        </h2>
        <p className="section-desc">
          Discover how humanoid robots can engage, entertain, assist, and interact
          with people in real-world environments.
        </p>
      </div>
      <div className="robotics-video-frame">
        {source?.type === "local" ? (
          <video
            controls
            preload="metadata"
            playsInline
            poster="/images/flagship.jpeg"
            aria-label="AURA humanoid robotics demonstration"
          >
            <source src={source.src} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        ) : source?.type === "embed" ? (
          <iframe
            src={source.src}
            title={source.title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="video-poster">
            <Image
              src="/images/flagship.jpeg"
              alt=""
              fill
              sizes="(max-width: 768px) 94vw, 980px"
              className="cover-image"
            />
            <div className="video-coming-soon">
              <span className="video-play-icon">
                <Icon name="play" />
              </span>
              <p>Robotics demonstration video coming soon</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
