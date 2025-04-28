import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default () => {
  const contentDir = 'src/_content/_collections/strava';
  const files = fs.readdirSync(contentDir);

  let totalDistance = 0;

  files.forEach((file) => {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    if (data.tags && data.tags.includes('kuzco-tracker')) {
      let distance = data.distance.replace('km', '');
      totalDistance += parseFloat(distance || 0);
    }
  });
  
  // Round to 1 decimal place (e.g. 12.3)
  totalDistance = totalDistance.toFixed(1);

  // Add km to the string
  totalDistance += ' km';


  return {
    totalDistance,
  };
};