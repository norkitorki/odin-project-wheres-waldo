import React from 'react';
import { useSelector } from 'react-redux';

export const Layout = ({ children }) => {
  const flash = useSelector((state) => state.flash);

  return (
    <div>
      {flash.success && <p className={'flash-success'}>{flash.success}</p>}
      {flash.notice && <p className={'flash-notice'}>{flash.notice}</p>}
      {flash.alert && <p className={'flash-alert'}>{flash.alert}</p>}

      {children}
    </div>
  );
};
