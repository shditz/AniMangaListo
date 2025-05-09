import SearchResults from "../SearchResults";

const AnimeSearch = ({ api }) => {
  return <SearchResults data={api.data} type="anime" />;
};

export default AnimeSearch;
