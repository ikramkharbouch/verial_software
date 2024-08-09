const Button = ({ styles, content, children }) => {
  return (
    <div className={`${styles} px-4 py-2 rounded-lg cursor-pointer`}>
      <span className="mr-2">{children}</span>
      {content}
    </div>
  );
};

export default Button;
