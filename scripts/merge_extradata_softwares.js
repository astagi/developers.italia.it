const fs = require('fs')
const yaml = require('js-yaml');

const CLOUD_PATH = './_data/crawler/all_cloud.json';
const SOFTWARE_PATH = './_data/crawler/softwares.yml';

const cloudData = JSON.parse(fs.readFileSync(CLOUD_PATH));
const softwaresData = yaml.load(fs.readFileSync(SOFTWARE_PATH));

const reorderProvidersByMode = (providers) => {
  const modes = {}
  for (const prov in providers) {
    if (prov === 'cloud-general'){
      continue
    }
    for (const mode in providers[prov]) {
      if (!modes[mode]) {
        modes[mode] = {
          ...providers['cloud-general'][mode],
          providers: []
        }
      }
      if (!modes[mode].providers[prov]) {
        modes[mode].providers.push({
          provider: prov,
          ...providers[prov][mode]
        })
      }
    }
  }
  console.log(modes)
  return modes;
}

for (software of softwaresData) {
  for (cloudDescription of cloudData) {
    if (cloudDescription.slug === software.slug) {
      software.cloud_data = reorderProvidersByMode(cloudDescription.providers)
    }
  }
}

fs.writeFileSync(SOFTWARE_PATH, yaml.dump(softwaresData))
