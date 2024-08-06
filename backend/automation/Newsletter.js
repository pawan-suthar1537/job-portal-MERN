import cron from "node-cron";
import { Job } from "../models/JobSchema.js";
import { User } from "../models/UserSchema.js";
import { sendEmail } from "../utils/sendemail.js";

export const newsletter = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const jobs = await Job.find({ newsletter: true });
      console.log("Jobs fetched:", jobs);

      for (const job of jobs) {
        try {
          const filteredUsers = await User.find({
            role: "jobseeker",
            $or: [
              { "niches.first": job.jobniches },
              { "niches.second": job.jobniches },
              { "niches.third": job.jobniches },
            ],
          });

          for (const user of filteredUsers) {
            const email = user.email;
            const subject = `Exciting Job Opportunity at ${job.companyname}`;

            const message = `
              Dear ${user.name},

              We are pleased to inform you about a new job opening for the position of ${
                job.title
              } at ${job.companyname}.

              **Job Details:**
              - **Position:** ${job.title}
              - **Type:** ${job.jobtype}
              - **Location:** ${job.location}
              - **Company:** ${job.companyname}
              - **Job Type:** ${job.jobtype}
              - **Salary:** ${job.salary}
              - **Hiring Multiple Candidates:** ${job.hiringmultiple}
              - **Job Niches:** ${job.jobniches}
              - **Responsibilities:** ${job.responsibility}
              - **Qualifications Required:** ${job.qualification}
              - **Additional Offers:** ${job.offers ? job.offers : "N/A"}
              - **Job Posted On:** ${job.jobposted.toDateString()}

              **Company Introduction:**
              ${job.introduction}

              For more details and to apply, please visit our website: [${
                job.website.title
              }](${job.website.url})

              We encourage you to apply as soon as possible if you meet the qualifications and are interested in this opportunity. 

              Thank you for considering this opportunity. We wish you the best in your job search.

              Best regards,
              Job Portal Team
            `;

            await sendEmail({ email, subject, message });
          }
          job.newsletter = false;
          await job.save();
        } catch (userError) {
          console.error(`Error processing job ${job._id}:`, userError.message);
        }
      }
    } catch (jobError) {
      console.error("Error fetching jobs:", jobError.message);
    }
  });
};
