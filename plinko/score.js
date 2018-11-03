const outputs = [];


function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 100;
  const k = 10;

  _.range(0, 3)
    .forEach(feature => {
      const data = _.map(outputs, row => [row[feature], _.last(row)]);
      const [testSet, trainingSet] = splitDataset(minMax(data, 1), testSetSize);
      const accuracy = _.chain(testSet)
        .filter(row => knn(trainingSet, _.initial(row), k) === _.last(row))
        .size()
        .divide(testSetSize)
        .value();
      console.log('For feature of', feature, 'Accuracy is', accuracy);
    });
  
}

function knn(data, point, k) {
  return Number(_.chain(data)
    .map(row => {
      return [
        distance(_.initial(row), point), 
        _.last(row),
      ]
    })
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .value()[0]);
    
}

function distance(pointA, pointB) {
  return Math.pow(_.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => Math.pow(a - b, 2))
    .sum()
    .value(), 0.5);
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  
  const testSet = _.slice(data, 0, testCount);

  const trainingSet = _.slice(data, testCount);

  return [testSet, trainingSet];
}

function minMax(data, featureCount) {
  const clonedData = _.cloneDeep(data);

  for (let i = 0; i < featureCount; i++) {
    const column = clonedData.map(row => row[i]);
    const min = _.min(column);
    const max = _.max(column);

    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }
  return clonedData;
}

