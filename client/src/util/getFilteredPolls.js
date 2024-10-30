import { calculateTotalVotes } from "./calculateTotalVotes";
import isPollExpired from "./isPollExpired";

const getFilteredPolls = (
  polls,
  searchTag,
  selectedTags,
  filterStatus,
  filterType,
  sortCriterion,
  votedPolls,
  filterVoted
) => {
  let filteredPolls = polls;

  if (selectedTags.length > 0) {
    filteredPolls = filteredPolls.filter((poll) =>
      selectedTags.every((tag) => poll.tags.includes(tag))
    );
  }

  if (searchTag) {
    filteredPolls = filteredPolls.filter((poll) =>
      poll.tags.some((tag) =>
        tag.toLowerCase().includes(searchTag.toLowerCase())
      )
    );
  }

  if (filterStatus === "expired") {
    filteredPolls = filteredPolls.filter((poll) =>
      isPollExpired(poll.expiresAt)
    );
  } else if (filterStatus === "not-expired") {
    filteredPolls = filteredPolls.filter(
      (poll) => !isPollExpired(poll.expiresAt)
    );
  }

  if (filterType === "public") {
    filteredPolls = filteredPolls.filter((poll) => poll.isPublic);
  } else if (filterType === "private") {
    filteredPolls = filteredPolls.filter((poll) => !poll.isPublic);
  }

  // Filter by voting status
  if (votedPolls) {
    if (filterVoted === "voted") {
      filteredPolls = filteredPolls.filter((poll) => votedPolls[poll._id]); // Polls the user has voted on
    } else if (filterVoted === "not-voted") {
      filteredPolls = filteredPolls.filter((poll) => !votedPolls[poll._id]); // Polls the user has not voted on
    }
  }

  // Sort based on the selected sorting criterion
  switch (sortCriterion) {
    case "mostVotes":
      filteredPolls.sort(
        (a, b) => calculateTotalVotes(b) - calculateTotalVotes(a)
      );
      break;
    case "endingSoon":
      filteredPolls.sort(
        (a, b) => new Date(a.expiresAt) - new Date(b.expiresAt)
      );
      break;
    case "oldest":
      filteredPolls.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      break;
    case "newest":
    default:
      filteredPolls.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      break;
  }

  return filteredPolls;
};

export default getFilteredPolls;
