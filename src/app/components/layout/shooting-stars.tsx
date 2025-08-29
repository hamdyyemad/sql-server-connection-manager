export default function ShootingStars() {
  return (
    <>
      {/* Shooting Star Container 1 */}
      <div
        className="absolute top-0 right-0 w-screen h-screen pointer-events-none"
        style={{
          position: "absolute",
          overflow: "hidden",
        }}
      ></div>

      {/* Shooting Star Container 2 */}
      <div
        className="absolute top-0 right-0 w-screen h-screen pointer-events-none"
        style={{
          position: "absolute",
          overflow: "hidden",
        }}
      ></div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                .absolute::before {
                    content: "";
                    position: absolute;
                    top: 20%;
                    right: 0;
                    rotate: -45deg;
                    width: 4em;
                    height: 1px;
                    background: linear-gradient(90deg, #ffffff, transparent);
                    animation: 3s shootingStar ease-out infinite;
                    animation-delay: 2s;
                    pointer-events: none;
                }
                
                .absolute:nth-child(2)::before {
                    top: 60%;
                    animation-delay: 4s;
                }
                
                @keyframes shootingStar {
                    0% {
                        transform: translateX(0) translateY(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    80% {
                        transform: translateX(-40em) translateY(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(-50em) translateY(0);
                        opacity: 0;
                    }
                }
            `,
        }}
      />
    </>
  );
}
