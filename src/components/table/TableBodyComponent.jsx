import Loading from '../Loading';

const TableBodyComponent = (props) => {
  const { children, headerItems, pagination, loading, search } = props;
  return (
    <div className="col-12">
      <div className="card">
        {search && search ? (
          <div className="card-body border-bottom py-2">
            <div className="d-flex">{search}</div>
          </div>
        ) : (
          ''
        )}

        <div className="table-responsive">
          <Loading loading={loading} />
          {!loading ? (
            <>
              <table className="table table-hover card-table table-vcenter text-nowrap datatable">
                <thead className="tb-hd-h">
                  <tr>
                    {headerItems?.map((item, index) => (
                      <th
                        key={index}
                        className={item?.width > 0 ? `tb-w-${item?.width}` : ''}
                      >
                        {item?.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{children}</tbody>
              </table>
              {pagination}
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default TableBodyComponent;
