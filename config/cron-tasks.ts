import {ScanMatchesJob} from "../src/jobs/scan-matches.job";
import {diContainer} from "../src/di-container";


const scanMatchesJob = diContainer.get(ScanMatchesJob);
export default {
  scanTrackedPlayers: {
    task: ({strapi}) => {
      scanMatchesJob.run();
    },
    options: {
      // Every 20 secs
      //rule: '*/20 * * * * *',

      // Every 5 mins
      rule: '*/5 * * * *',
    }
  }
};

