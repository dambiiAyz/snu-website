// internal
import { Search } from "@/svg";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";
import { useTranslation } from "react-i18next";

const HeaderSearchForm = () => {
  const { t } = useTranslation("common");
  const { setSearchText, handleSubmit, searchText } = useSearchFormSubmit();

  return (
    <form onSubmit={handleSubmit}>
      <div className="tp-header-search-wrapper d-flex align-items-center">
        <div className="tp-header-search-box">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            type="text"
            placeholder={t("header.searchPlaceholder")}
          />
        </div>
        <div className="tp-header-search-btn">
          <button type="submit">
            <Search />
          </button>
        </div>
      </div>
    </form>
  );
};

export default HeaderSearchForm;
