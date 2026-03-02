export const linearRegression = {
  simulate: (params: any) => {
    const { learningRate, epochs, noise } = params;
    
    // Generate synthetic data
    const data = generateData(100, noise);
    const lossHistory = [];
    
    // Initialize parameters
    let slope = Math.random() * 2 - 1;
    let intercept = Math.random() * 2 - 1;
    
    // Gradient descent simulation
    for (let epoch = 0; epoch < epochs; epoch++) {
      // Forward pass
      const predictions = data.x.map((x: number) => slope * x + intercept);
      
      // Compute loss (MSE)
      const loss = predictions.reduce((sum: number, pred: number, i: number) => {
        return sum + Math.pow(pred - data.y[i], 2);
      }, 0) / data.x.length;
      
      lossHistory.push(loss);
      
      // Compute gradients
      const gradSlope = predictions.reduce((sum: number, pred: number, i: number) => {
        return sum + (pred - data.y[i]) * data.x[i];
      }, 0) / data.x.length;
      
      const gradIntercept = predictions.reduce((sum: number, pred: number, i: number) => {
        return sum + (pred - data.y[i]);
      }, 0) / data.x.length;
      
      // Update parameters
      slope -= learningRate * gradSlope;
      intercept -= learningRate * gradIntercept;
    }
    
    return {
      data: {
        points: data.x.map((x: number, i: number) => ({
          x,
          y: data.y[i],
          cluster: 0,
        })),
        line: {
          x1: Math.min(...data.x),
          y1: slope * Math.min(...data.x) + intercept,
          x2: Math.max(...data.x),
          y2: slope * Math.max(...data.x) + intercept,
        },
      },
      lossHistory,
      parameters: { slope, intercept },
    };
  },
};

const generateData = (n: number, noise: number) => {
  const x = Array.from({ length: n }, () => Math.random() * 10 - 5);
  const trueSlope = 2;
  const trueIntercept = 1;
  
  const y = x.map((xi) => 
    trueSlope * xi + trueIntercept + (Math.random() - 0.5) * noise * 10
  );
  
  return { x, y };
};