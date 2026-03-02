import gsap from 'gsap';

export const animateGradientDescent = (
  points: HTMLElement[],
  line: HTMLElement,
  onUpdate?: (progress: number) => void
) => {
  const tl = gsap.timeline({
    onUpdate: function() {
      onUpdate?.(this.progress());
    },
  });

  tl.fromTo(points,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1, stagger: 0.05, ease: "back.out(1.7)" }
  );

  tl.fromTo(line,
    { scaleX: 0, transformOrigin: "left center" },
    { scaleX: 1, duration: 1.5, ease: "power2.out" },
    "-=0.5"
  );

  return tl;
};

export const animateKMeans = (
  centroids: HTMLElement[],
  points: HTMLElement[],
  onStepComplete?: (step: number) => void
) => {
  const tl = gsap.timeline({
    onComplete: () => onStepComplete?.(1),
  });

  tl.fromTo(centroids,
    { scale: 0, rotation: 360 },
    { scale: 1, rotation: 0, duration: 1, stagger: 0.2, ease: "elastic.out(1, 0.5)" }
  );

  return tl;
};

export const animateDecisionTree = (
  nodes: HTMLElement[],
  edges: HTMLElement[],
  onSplit?: (nodeId: string) => void
) => {
  const tl = gsap.timeline();

  nodes.forEach((node, i) => {
    tl.fromTo(node,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        onStart: () => onSplit?.(node.id),
      },
      i === 0 ? 0 : "+=0.2"
    );
  });

  return tl;
};