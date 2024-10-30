import Analyze from "../assets/Analyze.png";
import customize from "../assets/customize.png";
import WorkTogether from "../assets/WorkTogether.png";

export const contents = [
  {
    id: "home",
    heading: "Create Your Own Poll",
    description:
      "Create both public and private polls. You can invite specific individuals, ensuring personalized participation in private polls, while public polls are open to all.",
    image: customize,
    navigate_: "/createpoll",
    callToAction: "Create Poll",
  },
  {
    id: "dashboard",
    heading: "Manage Your Polls",
    description:
      "Take control of your polls with ease. Create, edit, and analyze your polls from one central dashboard. Track responses, generate reports,and share your results effortlessly.",
    image: Analyze,
    navigate_: "/dashboard",
    callToAction: "Dashboard",
  },
  {
    id: "polls",
    heading: "Participate in Polls",
    description:
      "Participate in large-scale public polls enabling them to contribute their opinions on trending topics or important discussions. <br /> Engage effortlessly in large-scale polls helping shape collective decisions and discover diverse viewpoints",
    image: WorkTogether,
    navigate_: "/allpolls",
    callToAction: "View Polls",
  },
];
