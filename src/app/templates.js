export const newsletterTemplates = {
  basic: {
    name: "Basic Update",
    content: `
        <h1>Newsletter Title</h1>
        <p>Hello {name},</p>
        <p>Write your main content here...</p>
        <p>Best regards,<br>Your Name</p>
      `,
  },
  announcement: {
    name: "New Announcement",
    content: `
        <div style="text-align: center;">
          <h1>🎉 Special Announcement 🎉</h1>
        </div>
        <p>Dear {name},</p>
        <p>We're excited to announce...</p>
        <div style="margin: 20px 0;">
          <h2>What's New:</h2>
          <ul>
            <li>Point 1</li>
            <li>Point 2</li>
            <li>Point 3</li>
          </ul>
        </div>
        <p>Warm regards,<br>Your Name</p>
      `,
  },
  monthly: {
    name: "Monthly Update",
    content: `
        <h1>Monthly Newsletter - [Month] [Year]</h1>
        <p>Hello {name},</p>
        <h2>This Month's Highlights</h2>
        <ul>
          <li>Highlight 1</li>
          <li>Highlight 2</li>
          <li>Highlight 3</li>
        </ul>
        <h2>Coming Up Next Month</h2>
        <p>Write about upcoming events/news...</p>
        <p>Best wishes,<br>Your Name</p>
      `,
  },
};
