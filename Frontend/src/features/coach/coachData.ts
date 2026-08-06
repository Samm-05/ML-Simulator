import { CoachModule } from './types';

export const coachModulesData: CoachModule[] = [
  {
    id: 'intro-ml',
    moduleNumber: 1,
    title: 'Introduction to Machine Learning',
    shortDescription: 'Basics of supervised and unsupervised learning.',
    iconName: 'sparkles',
    sections: [
      {
        id: 'sec-1-1',
        title: 'Welcome to Machine Learning',
        paragraphs: [
          'Machine Learning (ML) is a branch of artificial intelligence that gives computer systems the ability to automatically learn and improve from experience without being explicitly programmed.',
          'Instead of writing rigid step-by-step algorithms, we train statistical models on data to discover underlying patterns and make predictions on unseen inputs.',
        ],
        bulletPoints: [
          { label: 'Supervised Learning', text: 'Learning from labeled datasets (inputs + targets).' },
          { label: 'Unsupervised Learning', text: 'Discovering hidden patterns or clusters in unlabeled data.' },
          { label: 'Reinforcement Learning', text: 'Learning optimal actions through rewards and penalties.' },
        ],
      },
      {
        id: 'sec-1-2',
        title: 'The Supervised Learning Pipeline',
        paragraphs: [
          'In supervised learning, the model is presented with input features (X) alongside corresponding target labels (y). The primary goal is to learn a mapping function f(X) ≈ y.',
          'During training, an optimization algorithm minimizes a loss function to align the predictions as closely as possible with ground truth targets.',
        ],
        mathFormula: 'y = f(X) + \\epsilon',
        codeSnippet: {
          language: 'python',
          code: `# Supervised Learning basic setup
import numpy as np

# Input features (X) and Target labels (y)
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10]) # y = 2 * X

print("Features X shape:", X.shape)
print("Targets y shape:", y.shape)`,
        },
      },
      {
        id: 'sec-1-3',
        title: 'Evaluating Machine Learning Models',
        paragraphs: [
          'To ensure a trained model generalizes well to new, unseen data, we split our dataset into Training and Testing sets.',
          'Common evaluation metrics include Mean Squared Error (MSE) for regression tasks and Accuracy/F1-Score for classification tasks.',
        ],
        bulletPoints: [
          { label: 'Overfitting', text: 'Model performs exceptionally on training data but poorly on test data.' },
          { label: 'Underfitting', text: 'Model is too simple to capture the underlying structure of the data.' },
        ],
      },
    ],
  },
  {
    id: 'linear-regression',
    moduleNumber: 2,
    title: 'Linear Regression',
    shortDescription: 'Understanding relationships between variables.',
    iconName: 'trending-up',
    sections: [
      {
        id: 'sec-2-1',
        title: 'Introduction to Linear Models',
        paragraphs: [
          'Linear regression is a statistical method used to model the relationship between a dependent variable (target) and one or more independent variables (features). It assumes a linear relationship, meaning the change in the dependent variable is proportional to the change in the independent variables.',
          'In its simplest form, Simple Linear Regression, we deal with a single feature. The goal is to find the best-fitting straight line through a set of data points, minimizing the sum of squared residuals (the differences between observed and predicted values).',
        ],
        mathFormula: 'y = wx + b',
        bulletPoints: [
          { label: 'y', text: 'The predicted value (dependent variable).' },
          { label: 'x', text: 'The input feature (independent variable).' },
          { label: 'w', text: 'The weight (slope), determining how much x influences y.' },
          { label: 'b', text: 'The bias (y-intercept), shifting the line up or down.' },
        ],
        codeSnippet: {
          language: 'python',
          code: `import numpy as np
from sklearn.linear_model import LinearRegression

# Sample Data (features: X, targets: y)
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

# Initialize and train the model
model = LinearRegression()
model.fit(X, y)

# Predict a new value
prediction = model.predict([[6]])
print(f"Prediction for x=6: {prediction[0]:.2f}")`,
        },
      },
      {
        id: 'sec-2-2',
        title: 'Ordinary Least Squares & Cost Function',
        paragraphs: [
          'To measure how well a line fits our data points, we calculate the Mean Squared Error (MSE) cost function.',
          'The objective of linear regression training is to find the weight (w) and bias (b) parameters that minimize J(w, b).',
        ],
        mathFormula: 'J(w, b) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_w(x^{(i)}) - y^{(i)})^2',
        bulletPoints: [
          { label: 'Residual', text: 'The vertical distance between an observed data point and the regression line.' },
          { label: 'Squaring Residuals', text: 'Penalizes larger errors more heavily and prevents negative residuals from canceling positive ones.' },
        ],
      },
      {
        id: 'sec-2-3',
        title: 'Multiple Linear Regression & Matrix Formulation',
        paragraphs: [
          'When extending linear regression to multiple features (x₁, x₂, ..., xₙ), the prediction equation becomes a linear combination of all input features.',
          'We can represent all calculations efficiently using vector matrix multiplication in NumPy and linear algebra libraries.',
        ],
        mathFormula: '\\hat{y} = w_1 x_1 + w_2 x_2 + \\dots + w_n x_n + b = X w + b',
      },
    ],
  },
  {
    id: 'gradient-descent',
    moduleNumber: 3,
    title: 'Gradient Descent',
    shortDescription: 'Optimization algorithms for machine learning.',
    iconName: 'activity',
    sections: [
      {
        id: 'sec-3-1',
        title: 'The Optimization Problem',
        paragraphs: [
          'Gradient Descent is an iterative optimization algorithm used to minimize a cost function J(θ) by iteratively moving in the direction of steepest descent defined by the negative gradient.',
          'Imagine standing on a foggy mountain peak. To reach the bottom valley as fast as possible, you take steps in the direction where the slope descends most steeply.',
        ],
        mathFormula: '\\theta_{new} = \\theta_{old} - \\alpha \\nabla J(\\theta)',
        bulletPoints: [
          { label: 'α (Learning Rate)', text: 'Determines the size of the step taken at each iteration.' },
          { label: '∇J(θ)', text: 'The gradient vector containing partial derivatives of loss with respect to parameters.' },
        ],
      },
      {
        id: 'sec-3-2',
        title: 'Choosing the Learning Rate (α)',
        paragraphs: [
          'Selecting an appropriate learning rate is critical for gradient descent convergence.',
          'If α is too small, convergence is painfully slow. If α is too large, the steps can overshoot the minimum and diverge.',
        ],
        codeSnippet: {
          language: 'python',
          code: `# Basic Gradient Descent step implementation
def update_parameter(theta, gradient, learning_rate=0.01):
    new_theta = theta - learning_rate * gradient
    return new_theta

# Example parameter update
theta = 5.0
grad = 2.0 # Positive slope -> move left
theta = update_parameter(theta, grad, learning_rate=0.1)
print("Updated theta:", theta) # Output: 4.8`,
        },
      },
      {
        id: 'sec-3-3',
        title: 'Variants of Gradient Descent',
        paragraphs: [
          'Depending on the dataset size and computational constraints, we use different variants of gradient descent.',
        ],
        bulletPoints: [
          { label: 'Batch Gradient Descent', text: 'Computes gradient over the entire dataset per epoch (slow for huge datasets).' },
          { label: 'Stochastic Gradient Descent (SGD)', text: 'Updates parameters using 1 random sample at a time (fast, noisy updates).' },
          { label: 'Mini-Batch Gradient Descent', text: 'Updates parameters using small batches (e.g. 32, 64 samples).' },
        ],
      },
    ],
  },
  {
    id: 'neural-network',
    moduleNumber: 4,
    title: 'Neural Network Foundations',
    shortDescription: 'Building blocks of deep learning.',
    iconName: 'network',
    sections: [
      {
        id: 'sec-4-1',
        title: 'The Artificial Neuron (Perceptron)',
        paragraphs: [
          'Artificial Neural Networks (ANNs) are inspired by biological brain networks. The fundamental computational unit is the Perceptron.',
          'A perceptron takes input signals, computes a weighted sum plus bias (z = Σ wᵢxᵢ + b), and applies a non-linear activation function f(z).',
        ],
        mathFormula: 'a = f(z) = f\\left( \\sum_{i=1}^{n} w_i x_i + b \\right)',
      },
      {
        id: 'sec-4-2',
        title: 'Activation Functions & Non-linearity',
        paragraphs: [
          'Activation functions introduce non-linearity into neural networks, enabling them to learn complex non-linear decision boundaries.',
          'Without activation functions, any deep multi-layer network would mathematically collapse into a single linear transformation.',
        ],
        bulletPoints: [
          { label: 'Sigmoid', text: 'Maps outputs to range (0, 1) — ideal for binary classification probabilities.' },
          { label: 'ReLU', text: 'f(z) = max(0, z) — standard activation in modern deep networks.' },
          { label: 'Tanh', text: 'Maps outputs to range (-1, 1) — zero-centered activation.' },
        ],
      },
      {
        id: 'sec-4-3',
        title: 'Forward & Backpropagation',
        paragraphs: [
          'Training a neural network consists of two main passes:',
          '1. Forward Propagation: Input features travel forward through layers to calculate predictions and total loss.',
          '2. Backpropagation: Using calculus Chain Rule, gradients travel backward from output to input to update all network weights.',
        ],
        mathFormula: '\\frac{\\partial L}{\\partial W^{(l)}} = \\delta^{(l)} (a^{(l-1)})^T',
      },
    ],
  },
  {
    id: 'logistic-regression',
    moduleNumber: 5,
    title: 'Logistic Regression',
    shortDescription: 'Classification algorithms for decision boundaries.',
    iconName: 'target',
    sections: [
      {
        id: 'sec-5-1',
        title: 'Introduction to Binary Classification',
        paragraphs: [
          'Unlike linear regression which predicts continuous numbers, Logistic Regression is used for classification problems where the target variable y is categorical (e.g. 0 or 1).',
          'It maps linear weighted inputs to a probability output P(y=1|X) between 0 and 1 using the Sigmoid function.',
        ],
        mathFormula: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
      },
      {
        id: 'sec-5-2',
        title: 'Binary Cross-Entropy Loss',
        paragraphs: [
          'Mean Squared Error is non-convex when paired with Sigmoid. Instead, logistic regression uses Binary Cross-Entropy (Log Loss).',
        ],
        mathFormula: 'L_{BCE} = - \\left[ y \\log(\\hat{y}) + (1-y) \\log(1-\\hat{y}) \\right]',
        bulletPoints: [
          { label: 'Decision Threshold', text: 'If P(y=1|X) ≥ 0.5, predict Class 1; else predict Class 0.' },
          { label: 'Log Loss Penalty', text: 'Penalizes confident wrong predictions exponentially.' },
        ],
      },
    ],
  },
];
