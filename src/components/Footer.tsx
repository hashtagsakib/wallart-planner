export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Copyrights by{" "}
            <a 
              href="https://instagram.com/hashtagsakib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline transition-colors"
            >
              Nazmus Sakib
            </a>{" "}
            | Terms & Conditions
          </p>
        </div>
      </div>
    </footer>
  );
};