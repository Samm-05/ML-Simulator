export const decisionTree = {
  simulate: (params: any) => {
    const { maxDepth, minSamplesSplit, criterion } = params;
    
    // Generate synthetic dataset
    const data = generateClassificationData(200);
    const lossHistory = [];
    
    // Build decision tree
    const tree = buildTree(data, 0, maxDepth, minSamplesSplit, criterion);
    
    // Calculate training accuracy
    const predictions = data.points.map((point: any) => predict(tree, point));
    const accuracy = predictions.filter((p: number, i: number) => p === data.labels[i]).length / data.labels.length;
    lossHistory.push(1 - accuracy);
    
    return {
      data: {
        points: data.points.map((point: any, i: number) => ({
          ...point,
          label: data.labels[i],
          predicted: predictions[i],
        })),
        tree: tree,
      },
      lossHistory,
      parameters: { tree, accuracy },
    };
  },
};

const generateClassificationData = (n: number) => {
  const points = [];
  const labels = [];
  
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 10 - 5;
    const y = Math.random() * 10 - 5;
    points.push({ x, y });
    
    // Create two interleaving half-moons
    const label = (Math.pow(x, 2) + Math.pow(y, 2) < 15) ? 1 : 0;
    labels.push(label);
  }
  
  return { points, labels };
};

const buildTree = (data: any, depth: number, maxDepth: number, minSamplesSplit: number, criterion: string) => {
  if (depth >= maxDepth || data.points.length < minSamplesSplit || isPure(data.labels)) {
    return {
      isLeaf: true,
      value: majorityClass(data.labels),
      samples: data.points.length,
    };
  }
  
  const bestSplit = findBestSplit(data, criterion);
  
  if (!bestSplit) {
    return {
      isLeaf: true,
      value: majorityClass(data.labels),
      samples: data.points.length,
    };
  }
  
  const leftData = splitData(data, bestSplit, 'left');
  const rightData = splitData(data, bestSplit, 'right');
  
  return {
    isLeaf: false,
    feature: bestSplit.feature,
    threshold: bestSplit.threshold,
    left: buildTree(leftData, depth + 1, maxDepth, minSamplesSplit, criterion),
    right: buildTree(rightData, depth + 1, maxDepth, minSamplesSplit, criterion),
    samples: data.points.length,
    impurity: bestSplit.impurity,
  };
};

const findBestSplit = (data: any, criterion: string) => {
  let bestGain = -Infinity;
  let bestSplit = null;
  
  const currentImpurity = calculateImpurity(data.labels, criterion);
  
  // Try splits on x and y features
  ['x', 'y'].forEach(feature => {
    const values = data.points.map((p: any) => p[feature]).sort();
    
    // Try thresholds between consecutive values
    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i] + values[i + 1]) / 2;
      
      const leftLabels = data.points
        .filter((_: any, idx: number) => data.points[idx][feature] <= threshold)
        .map((_: any, idx: number) => data.labels[idx]);
      
      const rightLabels = data.points
        .filter((_: any, idx: number) => data.points[idx][feature] > threshold)
        .map((_: any, idx: number) => data.labels[idx]);
      
      if (leftLabels.length === 0 || rightLabels.length === 0) continue;
      
      const leftImpurity = calculateImpurity(leftLabels, criterion);
      const rightImpurity = calculateImpurity(rightLabels, criterion);
      
      const gain = currentImpurity - (
        (leftLabels.length / data.labels.length) * leftImpurity +
        (rightLabels.length / data.labels.length) * rightImpurity
      );
      
      if (gain > bestGain) {
        bestGain = gain;
        bestSplit = {
          feature,
          threshold,
          impurity: currentImpurity,
          gain,
        };
      }
    }
  });
  
  return bestSplit;
};

const calculateImpurity = (labels: number[], criterion: string) => {
  const counts = labels.reduce((acc: any, label) => {
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  
  const proportions = Object.values(counts).map((c: any) => c / labels.length);
  
  if (criterion === 'gini') {
    return 1 - proportions.reduce((sum: number, p: number) => sum + p * p, 0);
  } else {
    // Entropy
    return -proportions.reduce((sum: number, p: number) => 
      sum + (p > 0 ? p * Math.log2(p) : 0), 0
    );
  }
};

const splitData = (data: any, split: any, side: string) => {
  const indices = data.points
    .map((_: any, idx: number) => idx)
    .filter((idx: number) => {
      if (side === 'left') {
        return data.points[idx][split.feature] <= split.threshold;
      } else {
        return data.points[idx][split.feature] > split.threshold;
      }
    });
  
  return {
    points: indices.map((i: number) => data.points[i]),
    labels: indices.map((i: number) => data.labels[i]),
  };
};

const isPure = (labels: number[]) => {
  return new Set(labels).size === 1;
};

const majorityClass = (labels: number[]) => {
  const counts = labels.reduce((acc: any, label) => {
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(counts).reduce((a: any, b: any) => 
    a[1] > b[1] ? a : b
  )[0];
};

const predict = (tree: any, point: any): number => {
  if (tree.isLeaf) {
    return tree.value;
  }
  
  if (point[tree.feature] <= tree.threshold) {
    return predict(tree.left, point);
  } else {
    return predict(tree.right, point);
  }
};