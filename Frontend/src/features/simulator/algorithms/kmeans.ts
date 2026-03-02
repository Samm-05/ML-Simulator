export const kMeans = {
  simulate: (params: any) => {
    const { k, maxIterations } = params;
    
    // Generate synthetic data
    const data = generateClusteredData(200, k);
    const lossHistory = [];
    
    // Initialize centroids randomly
    let centroids = initializeCentroids(data.points, k);
    
    // K-means iteration
    for (let iter = 0; iter < maxIterations; iter++) {
      // Assign points to nearest centroid
      const assignments = assignClusters(data.points, centroids);
      
      // Compute inertia (within-cluster sum of squares)
      const inertia = computeInertia(data.points, assignments, centroids);
      lossHistory.push(inertia);
      
      // Update centroids
      const newCentroids = updateCentroids(data.points, assignments, k);
      
      // Check convergence
      if (hasConverged(centroids, newCentroids)) {
        break;
      }
      
      centroids = newCentroids;
    }
    
    return {
      data: {
        points: data.points.map((point: any, i: number) => ({
          ...point,
          cluster: data.assignments[i],
        })),
        centroids: centroids.map((c: any, i: number) => ({
          ...c,
          cluster: i,
        })),
      },
      lossHistory,
      parameters: { centroids },
    };
  },
};

const generateClusteredData = (n: number, k: number) => {
  const points = [];
  const centers = Array.from({ length: k }, () => ({
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 20,
  }));
  
  for (let i = 0; i < n; i++) {
    const center = centers[Math.floor(Math.random() * k)];
    points.push({
      x: center.x + (Math.random() - 0.5) * 2,
      y: center.y + (Math.random() - 0.5) * 2,
    });
  }
  
  return { points, assignments: new Array(n).fill(0) };
};

const initializeCentroids = (points: any[], k: number) => {
  // K-means++ initialization
  const centroids = [];
  centroids.push(points[Math.floor(Math.random() * points.length)]);
  
  for (let i = 1; i < k; i++) {
    const distances = points.map(point => 
      Math.min(...centroids.map(c => distance(point, c)))
    );
    const sumDistances = distances.reduce((a, b) => a + b, 0);
    const probabilities = distances.map(d => d / sumDistances);
    
    let r = Math.random();
    let cumulativeProb = 0;
    for (let j = 0; j < points.length; j++) {
      cumulativeProb += probabilities[j];
      if (r < cumulativeProb) {
        centroids.push(points[j]);
        break;
      }
    }
  }
  
  return centroids;
};

const assignClusters = (points: any[], centroids: any[]) => {
  return points.map(point => {
    let minDist = Infinity;
    let cluster = 0;
    
    centroids.forEach((centroid, i) => {
      const dist = distance(point, centroid);
      if (dist < minDist) {
        minDist = dist;
        cluster = i;
      }
    });
    
    return cluster;
  });
};

const updateCentroids = (points: any[], assignments: number[], k: number) => {
  const centroids = Array.from({ length: k }, () => ({ x: 0, y: 0 }));
  const counts = new Array(k).fill(0);
  
  points.forEach((point, i) => {
    const cluster = assignments[i];
    centroids[cluster].x += point.x;
    centroids[cluster].y += point.y;
    counts[cluster]++;
  });
  
  centroids.forEach((centroid, i) => {
    if (counts[i] > 0) {
      centroid.x /= counts[i];
      centroid.y /= counts[i];
    }
  });
  
  return centroids;
};

const computeInertia = (points: any[], assignments: number[], centroids: any[]) => {
  return points.reduce((sum, point, i) => {
    const centroid = centroids[assignments[i]];
    return sum + distance(point, centroid) ** 2;
  }, 0);
};

const hasConverged = (oldCentroids: any[], newCentroids: any[]) => {
  const threshold = 0.001;
  return oldCentroids.every((c, i) => distance(c, newCentroids[i]) < threshold);
};

const distance = (a: any, b: any) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};