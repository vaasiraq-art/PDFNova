import { Link } from 'react-router-dom';
import { tools } from '../data/tools';

export default function Home() {
  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: months[date.getMonth()],
      day: date.getDate(),
      year: date.getFullYear()
    };
  };

  const today = new Date();
  const dateInfo = formatDate(today);

  return (
    <div>
      {/* Welcome Post */}
      <article className="box post post-excerpt">
        <header>
          <h2><Link to="/">Welcome to PDFNova</Link></h2>
          <p>Free online PDF tools for all your document needs</p>
        </header>
        <div className="info">
          <span className="date">
            <span className="month">{dateInfo.month}</span>
            <span className="day">{dateInfo.day}</span>
            <span className="year">, {dateInfo.year}</span>
          </span>
          <ul className="stats">
            <li><a href="#">16 Tools</a></li>
            <li><a href="#">100% Free</a></li>
            <li><a href="#">Secure</a></li>
          </ul>
        </div>
        <p>
          <strong>Hello!</strong> You're looking at <strong>PDFNova</strong>, a complete suite of free online PDF tools. 
          Merge, split, compress, convert, and edit PDFs with ease. All processing happens directly in your browser, 
          ensuring your files never leave your device.
        </p>
        <p>
          PDFNova offers everything you need to work with PDF documents. Whether you're combining multiple files, 
          extracting pages, reducing file size, or converting between formats, we've got you covered. 
          No registration required, no file limits, completely free.
        </p>
      </article>

      {/* Tools as Posts */}
      {tools.slice(0, 6).map((tool, index) => {
        const toolDate = new Date(today);
        toolDate.setDate(today.getDate() - (index + 1) * 3);
        const toolDateInfo = formatDate(toolDate);

        return (
          <article key={tool.id} className="box post post-excerpt">
            <header>
              <h2><Link to={`/tools/${tool.id}`}>{tool.name}</Link></h2>
              <p>{tool.description}</p>
            </header>
            <div className="info">
              <span className="date">
                <span className="month">{toolDateInfo.month}</span>
                <span className="day">{toolDateInfo.day}</span>
                <span className="year">, {toolDateInfo.year}</span>
              </span>
              <ul className="stats">
                <li><a href="#">Free</a></li>
                <li><a href="#">{tool.category}</a></li>
              </ul>
            </div>
            <p>
              {tool.description}. This tool is completely free to use with no registration required. 
              All processing happens in your browser, so your files are never uploaded to any server. 
              Fast, secure, and easy to use.
            </p>
            <p>
              <Link to={`/tools/${tool.id}`} className="button">
                Use {tool.name} →
              </Link>
            </p>
          </article>
        );
      })}

      {/* Pagination */}
      <div className="pagination">
        <div className="pages">
          <a href="#" className="active">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
        </div>
        <Link to="/" className="button next">View All Tools</Link>
      </div>
    </div>
  );
}
