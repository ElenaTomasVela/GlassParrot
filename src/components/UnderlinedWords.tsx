export default function UnderlinedWords(props: {
  text: string;
  underlinedWords: number;
}) {
  const { text, underlinedWords } = props;

  const words = text.split(" ");

  const underlinedText = words.slice(-underlinedWords).join(" ");
  const remainingText = words
    .slice(0, words.length - underlinedWords)
    .join(" ");

  return (
    <span>
      {remainingText}{" "}
      <span className="underline underline-offset-3 decoration-3 decoration-secondary">
        {underlinedText}
      </span>
    </span>
  );
}
