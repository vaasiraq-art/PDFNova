import { Link, useLocation } from 'react-router-dom';
import { tools, categories } from '../data/tools';

export default function Sidebar() {
  const location = useLocation();

  const getCurrentMonth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date().getMonth()];
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <div id="sidebar">
      {/* Logo */}
      <h1 id="logo">
        <Link to="/">PDFNOVA</Link>
      </h1>

      {/* Navigation */}
      <nav id="nav">
        <ul>
          <li className={location.pathname === '/' ? 'current' : ''}>
            <Link to="/">All Tools</Link>
          </li>
          <li className={location.pathname === '/tools/merge-pdf' ? 'current' : ''}>
            <Link to="/tools/merge-pdf">Merge PDF</Link>
          </li>
          <li className={location.pathname === '/tools/compress-pdf' ? 'current' : ''}>
            <Link to="/tools/compress-pdf">Compress PDF</Link>
          </li>
          <li className={location.pathname === '/tools/pdf-to-jpg' ? 'current' : ''}>
            <Link to="/tools/pdf-to-jpg">Convert PDF</Link>
          </li>
          <li className={location.pathname === '/reader' ? 'current' : ''}>
            <Link to="/reader">PDF Reader</Link>
          </li>
        </ul>
      </nav>

      {/* Search */}
      <section className="box search">
        <form method="post" action="#">
          <input type="text" className="text" name="search" placeholder="Search tools..." />
        </form>
      </section>

      {/* About */}
      <section className="box text-style1">
        <div className="inner">
          <p>
            <strong>PDFNova:</strong> Free online PDF tools. Merge, split, compress, and convert PDFs. 
            All processing happens in your browser for maximum privacy.
          </p>
        </div>
      </section>

      {/* Recent Tools */}
      <section className="box recent-posts">
        <header>
          <h2>Popular Tools</h2>
        </header>
        <ul>
          {tools.slice(0, 5).map(tool => (
            <li key={tool.id}>
              <Link to={`/tools/${tool.id}`}>{tool.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section className="box recent-comments">
        <header>
          <h2>Categories</h2>
        </header>
        <ul>
          {categories.filter(c => c !== 'All').map(category => (
            <li key={category}>
              <Link to="/">{category}</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Calendar */}
      <section className="box calendar">
        <div className="inner">
          <table>
            <caption>{getCurrentMonth()} {getCurrentYear()}</caption>
            <thead>
              <tr>
                <th scope="col" title="Monday">M</th>
                <th scope="col" title="Tuesday">T</th>
                <th scope="col" title="Wednesday">W</th>
                <th scope="col" title="Thursday">T</th>
                <th scope="col" title="Friday">F</th>
                <th scope="col" title="Saturday">S</th>
                <th scope="col" title="Sunday">S</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="pad"><span>&nbsp;</span></td>
                <td><span>1</span></td>
                <td><span>2</span></td>
                <td><span>3</span></td>
              </tr>
              <tr>
                <td><span>4</span></td>
                <td><span>5</span></td>
                <td><span>6</span></td>
                <td><span>7</span></td>
                <td><span>8</span></td>
                <td><span>9</span></td>
                <td><Link to="/">10</Link></td>
              </tr>
              <tr>
                <td><span>11</span></td>
                <td><span>12</span></td>
                <td><span>13</span></td>
                <td className="today"><Link to="/">14</Link></td>
                <td><span>15</span></td>
                <td><span>16</span></td>
                <td><span>17</span></td>
              </tr>
              <tr>
                <td><span>18</span></td>
                <td><span>19</span></td>
                <td><span>20</span></td>
                <td><span>21</span></td>
                <td><span>22</span></td>
                <td><Link to="/">23</Link></td>
                <td><span>24</span></td>
              </tr>
              <tr>
                <td><Link to="/">25</Link></td>
                <td><span>26</span></td>
                <td><span>27</span></td>
                <td><span>28</span></td>
                <td className="pad" colSpan={3}><span>&nbsp;</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Copyright */}
      <ul id="copyright">
        <li>&copy; PDFNova.</li>
        <li>Design: <a href="https://html5up.net">HTML5 UP</a> (adapted)</li>
      </ul>
    </div>
  );
}
