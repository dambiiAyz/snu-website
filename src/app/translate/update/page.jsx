'use client';

import { useEffect, useMemo, useState } from "react";

const LOCALES = [
  { code: "en", label: "English (EN)" },
  { code: "mn", label: "Mongol (MN)" },
  { code: "cz", label: "China (CZ)" },
];

const SECTION_LABELS = {
  language: { en: "Language", mn: "Хэл", cz: "语言" },
  footer: { en: "Footer", mn: "Доод хэсэг", cz: "页脚" },
  errors: { en: "Errors", mn: "Алдаа", cz: "错误" },
  home: { en: "Home", mn: "Нүүр", cz: "首页" },
  breadcrumb: { en: "Breadcrumb", mn: "Навигаци", cz: "面包屑" },
  shop: { en: "Shop", mn: "Дэлгүүр", cz: "商店" },
  search: { en: "Search", mn: "Хайлт", cz: "搜索" },
  cart: { en: "Cart", mn: "Сагс", cz: "购物车" },
  wishlist: { en: "Wishlist", mn: "Хүсэлтийн жагсаалт", cz: "心愿单" },
  compare: { en: "Compare", mn: "Харьцуулах", cz: "对比" },
  checkout: { en: "Checkout", mn: "Төлбөр", cz: "结账" },
  productDetails: { en: "Product Details", mn: "Бүтээгдэхүүний дэлгэрэнгүй", cz: "商品详情" },
  product: { en: "Product", mn: "Бүтээгдэхүүн", cz: "商品" },
  contact: { en: "Contact", mn: "Холбоо барих", cz: "联系我们" },
};

const flatten = (obj, prefix = "") => {
  const result = {};
  Object.entries(obj || {}).forEach(([key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flatten(value, nextKey));
    } else {
      result[nextKey] = value;
    }
  });
  return result;
};

const unflatten = (flat) => {
  const result = {};
  Object.entries(flat || {}).forEach(([path, value]) => {
    const keys = path.split(".");
    let cursor = result;
    keys.forEach((k, idx) => {
      if (idx === keys.length - 1) {
        cursor[k] = value;
        return;
      }
      if (!cursor[k] || typeof cursor[k] !== "object") {
        cursor[k] = {};
      }
      cursor = cursor[k];
    });
  });
  return result;
};

const getSectionKey = (key) => key.split(".")[0] || "root";

export default function TranslateUpdatePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState("both");
  const [searchLocales, setSearchLocales] = useState({
    en: true,
    mn: true,
    cz: true,
  });
  const [accessKey, setAccessKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [flatData, setFlatData] = useState({ en: {}, mn: {}, cz: {} });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.sessionStorage.getItem("translateAccess");
    if (saved === "snuapp") {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      setError("");
    }
  }, [isAuthorized]);

  const allKeys = useMemo(() => {
    const set = new Set([
      ...Object.keys(flatData.en || {}),
      ...Object.keys(flatData.mn || {}),
      ...Object.keys(flatData.cz || {}),
    ]);
    return Array.from(set).sort();
  }, [flatData]);

  const sections = useMemo(() => {
    const map = new Map();
    allKeys.forEach((key) => {
      const section = getSectionKey(key);
      if (!map.has(section)) map.set(section, []);
      map.get(section).push(key);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [allKeys]);

  const filteredKeys = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) {
      const section = sections.find(([name]) => name === activeSection);
      return section ? section[1] : [];
    }
    return allKeys.filter((k) => {
      const matchesKey = k.toLowerCase().includes(lower);
      if (searchMode === "key") return matchesKey;

      const matchesValue = LOCALES.some((l) => {
        if (!searchLocales[l.code]) return false;
        const value = flatData[l.code]?.[k];
        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(lower);
      });

      if (searchMode === "value") return matchesValue;
      return matchesKey || matchesValue;
    });
  }, [query, allKeys, sections, activeSection, searchMode, searchLocales, flatData]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/translate/update", { cache: "no-store" });
        const json = await res.json();
        if (!json?.ok) {
          throw new Error(json?.message || "Failed to load translations.");
        }
        setFlatData({
          en: flatten(json.data.en),
          mn: flatten(json.data.mn),
          cz: flatten(json.data.cz),
        });
      } catch (err) {
        setError(err?.message || "Failed to load translations.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (sections.length > 0 && !sections.find(([n]) => n === activeSection)) {
      setActiveSection(sections[0][0]);
    }
  }, [sections, activeSection]);

  const handleChange = (locale, key, value) => {
    setFlatData((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const payload = {
        data: {
          en: unflatten(flatData.en),
          mn: unflatten(flatData.mn),
          cz: unflatten(flatData.cz),
        },
      };
      const res = await fetch("/api/translate/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json?.ok) {
        throw new Error(json?.message || "Failed to save translations.");
      }
    } catch (err) {
      setError(err?.message || "Failed to save translations.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthorized) {
    return (
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5">
              <div className="tp-shop-widget">
                <h2 style={{ marginBottom: 10 }}>Protected</h2>
                <p style={{ marginBottom: 16 }}>
                  Enter access key to continue.
                </p>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Access key"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                />
                <button
                  className="tp-btn w-100"
                  style={{ marginTop: 12 }}
                  type="button"
                  onClick={() => {
                    if (accessKey === "snuapp") {
                      if (typeof window !== "undefined") {
                        window.sessionStorage.setItem("translateAccess", accessKey);
                      }
                      setIsAuthorized(true);
                    } else {
                      setError("Invalid access key.");
                    }
                  }}
                >
                  Continue
                </button>
                {error && (
                  <p style={{ color: "red", marginTop: 10 }}>{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "40px 0" }}>
      <div className="container">
        <div className="mb-30">
          <h2>Translations Editor</h2>
          <p style={{ marginTop: 6 }}>
            Edit EN/MN/CZ text for `common.json` and save.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <div className="tp-shop-sidebar mr-10">
              <div className="tp-shop-widget mb-30">
                <h3 className="tp-shop-widget-title">Sections</h3>
                <div className="tp-shop-widget-content">
                  <ul className="filter-items filter-checkbox">
                    {sections.map(([name]) => (
                      <li key={name} className="filter-item checkbox">
                        <label
                          onClick={() => setActiveSection(name)}
                          style={{ cursor: "pointer", fontWeight: activeSection === name ? 600 : 400 }}
                        >
                          {SECTION_LABELS[name]?.en || name}
                          {SECTION_LABELS[name] && (
                            <span style={{ display: "block", fontSize: 12, opacity: 0.8 }}>
                              {SECTION_LABELS[name].mn} / {SECTION_LABELS[name].cz}
                            </span>
                          )}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="tp-shop-widget mb-30">
                <h3 className="tp-shop-widget-title">Search</h3>
                <div className="tp-shop-widget-content">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search key..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: "block", marginBottom: 6 }}>
                      <input
                        type="radio"
                        name="searchMode"
                        value="key"
                        checked={searchMode === "key"}
                        onChange={() => setSearchMode("key")}
                      />{" "}
                      Key
                    </label>
                    <label style={{ display: "block", marginBottom: 6 }}>
                      <input
                        type="radio"
                        name="searchMode"
                        value="value"
                        checked={searchMode === "value"}
                        onChange={() => setSearchMode("value")}
                      />{" "}
                      Value
                    </label>
                    <label style={{ display: "block" }}>
                      <input
                        type="radio"
                        name="searchMode"
                        value="both"
                        checked={searchMode === "both"}
                        onChange={() => setSearchMode("both")}
                      />{" "}
                      Key + Value
                    </label>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ marginBottom: 6 }}>Languages</div>
                    {LOCALES.map((l) => (
                      <label key={l.code} style={{ display: "block", marginBottom: 4 }}>
                        <input
                          type="checkbox"
                          checked={searchLocales[l.code]}
                          onChange={(e) =>
                            setSearchLocales((prev) => ({
                              ...prev,
                              [l.code]: e.target.checked,
                            }))
                          }
                        />{" "}
                        {l.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="tp-shop-widget mb-30">
                <button
                  className="tp-btn w-100"
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {error && (
                  <p style={{ color: "red", marginTop: 10 }}>{error}</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "30%" }}>Key</th>
                      {LOCALES.map((l) => (
                        <th key={l.code} style={{ width: "23%" }}>
                          {l.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeys.map((key) => (
                      <tr key={key}>
                        <td>
                          <code>{key}</code>
                        </td>
                        {LOCALES.map((l) => (
                          <td key={`${key}-${l.code}`}>
                            <input
                              className="form-control"
                              type="text"
                              value={flatData[l.code][key] ?? ""}
                              onChange={(e) =>
                                handleChange(l.code, key, e.target.value)
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    {filteredKeys.length === 0 && (
                      <tr>
                        <td colSpan={4}>No keys found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
