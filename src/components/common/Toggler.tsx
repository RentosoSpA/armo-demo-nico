import React from 'react';
import { Radio, type RadioChangeEvent } from 'antd';
import './Toggler.scss';

interface TogglerProps {
  id: string;
  options: {
    label: string;
    value: string;
  }[];
  renderableComponents: {
    [key: string]: React.ReactNode;
  };
  activeComponent: string;
  setActiveComponent: (value: string) => void;
}

const Toggler: React.FC<TogglerProps> = ({
  id,
  options,
  renderableComponents,
  activeComponent,
  setActiveComponent,
}) => {
  const renderComponent = () => {
    return renderableComponents[activeComponent];
  };

  const handleChange = (e: RadioChangeEvent) => {
    setActiveComponent(e.target.value);
  };

  return (
    <>
      <Radio.Group
        id={id}
        block
        optionType="button"
        buttonStyle="solid"
        value={activeComponent}
        options={options}
        onChange={handleChange}
        className="toggler-radio-group"
      />
      {renderComponent()}
    </>
  );
};

export default Toggler;
