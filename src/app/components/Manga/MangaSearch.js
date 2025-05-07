import SearchResults from "../SearchResults";

const MangaSearch = ({ api }) => {
  return <SearchResults data={api.data} type="manga" />;
};

export default MangaSearch;
