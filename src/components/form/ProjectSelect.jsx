import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { fetchData } from '../../services/$service';
import { ROUTE_API } from '../../utils/route-util';
const fetchProject = async () =>
  fetchData(ROUTE_API.operationCustomerProduct, {}, 'GET');

export default function ProjectSelect({
  value,
  onChange,
  placeholder = 'Select project...',
  isMulti = true,
  closeMenuOnSelect = false,
  styles,
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetchProject();

        const payload =
          res?.category ||
          res?.data?.category ||
          res?.data?.data?.category ||
          res?.result?.category ||
          res?.body?.category ||
          [];

        const mapped = (Array.isArray(payload) ? payload : []).map((item) => ({
          label: item?.label ?? String(item?.name ?? item?.value ?? ''),
          value:
            item?.value ??
            item?.uuid ??
            item?.id ??
            item?.code ??
            item?.label ??
            '',
          _raw: item,
        }));

        if (mounted) setOptions(mapped);
      } catch (e) {
        console.error('[ProjectSelect] load error:', e);
        if (mounted) setLoadError(e?.message, 'Failed to load projects');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const noOptionsMessage = useMemo(
    () => () =>
      loading ? 'Loading...' : loadError ? 'Failed to load' : 'No projects',
    [loading, loadError]
  );

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      isMulti={isMulti}
      placeholder={placeholder}
      closeMenuOnSelect={closeMenuOnSelect}
      isLoading={loading}
      isDisabled={loading}
      styles={styles}
      getOptionLabel={(opt) => opt.label}
      getOptionValue={(opt) => String(opt.value)}
      noOptionsMessage={noOptionsMessage}
    />
  );
}
