import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to MM Furniture</h1>
          <p className="text-xl mb-8">Discover quality furniture for every room in your home</p>
          <Link to="/products" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {['Sofa', 'Bed', 'Chair', 'Table'].map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="card p-6 text-center hover:scale-105 transition-transform"
              >
                <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">{category}</span>
                </div>
                <h3 className="text-xl font-semibold">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
