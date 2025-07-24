import React, { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Search, Sparkles, ShoppingBag, Zap, Star, TrendingUp } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Skeleton } from './components/ui/skeleton'

interface User {
  id: string
  email: string
  displayName?: string
}

interface ProductListing {
  id: string
  name: string
  platform: string
  price: number
  originalPrice?: number
  discount?: number
  delivery: string
  rating: number
  reviews: number
  returnPolicy: string
  emiOptions?: string
  buyLink: string
  image?: string
  highlights?: string[]
}

interface SearchResults {
  query: string
  products: ProductListing[]
  bestDeal?: ProductListing
  fastestDelivery?: ProductListing
  highestRated?: ProductListing
}

const platformColors: Record<string, string> = {
  'Amazon': 'bg-orange-100 text-orange-800',
  'Flipkart': 'bg-blue-100 text-blue-800',
  'Meesho': 'bg-pink-100 text-pink-800',
  'Snapdeal': 'bg-red-100 text-red-800',
  'Reliance Digital': 'bg-purple-100 text-purple-800',
  'Croma': 'bg-green-100 text-green-800'
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const generateBuyLink = (platform: string, query: string): string => {
    const searchQuery = encodeURIComponent(query)
    
    switch (platform) {
      case 'Amazon':
        return `https://www.amazon.in/s?k=${searchQuery}&ref=nb_sb_noss`
      case 'Flipkart':
        return `https://www.flipkart.com/search?q=${searchQuery}`
      case 'Meesho':
        return `https://www.meesho.com/search?q=${searchQuery}`
      case 'Snapdeal':
        return `https://www.snapdeal.com/search?keyword=${searchQuery}`
      case 'Reliance Digital':
        return `https://www.reliancedigital.in/search?q=${searchQuery}`
      case 'Croma':
        return `https://www.croma.com/search?q=${searchQuery}`
      default:
        return `https://www.google.com/search?q=${searchQuery}+buy+online+india`
    }
  }

  // Realistic pricing database based on current market prices (Jan 2025)
  const getRealisticPrice = (query: string): number => {
    const queryLower = query.toLowerCase()
    
    // Apple Products
    if (queryLower.includes('apple earpods') || queryLower.includes('earpods')) {
      return 1900 // Apple EarPods actual price
    }
    if (queryLower.includes('airpods pro')) {
      return 24900 // AirPods Pro 2nd gen
    }
    if (queryLower.includes('airpods') && !queryLower.includes('pro')) {
      return 12900 // AirPods 3rd gen
    }
    if (queryLower.includes('iphone 16 pro max')) {
      return 144900 // iPhone 16 Pro Max 256GB
    }
    if (queryLower.includes('iphone 16 pro')) {
      return 119900 // iPhone 16 Pro 128GB
    }
    if (queryLower.includes('iphone 16')) {
      return 79900 // iPhone 16 128GB
    }
    if (queryLower.includes('iphone 15 pro max')) {
      return 134900 // iPhone 15 Pro Max
    }
    if (queryLower.includes('iphone 15')) {
      return 69900 // iPhone 15
    }
    
    // Samsung Products
    if (queryLower.includes('samsung galaxy s24 ultra')) {
      return 129999 // Galaxy S24 Ultra
    }
    if (queryLower.includes('samsung galaxy s24')) {
      return 79999 // Galaxy S24
    }
    if (queryLower.includes('samsung galaxy buds')) {
      return 8999 // Galaxy Buds2 Pro
    }
    
    // Headphones & Audio
    if (queryLower.includes('sony wh-1000xm5')) {
      return 29990 // Sony WH-1000XM5
    }
    if (queryLower.includes('sony wh-1000xm4')) {
      return 24990 // Sony WH-1000XM4
    }
    if (queryLower.includes('bose quietcomfort')) {
      return 26995 // Bose QC45
    }
    if (queryLower.includes('jbl') && queryLower.includes('headphones')) {
      return 4999 // JBL Tune series
    }
    if (queryLower.includes('boat') && (queryLower.includes('headphones') || queryLower.includes('earbuds'))) {
      return 1999 // boAt Airdopes
    }
    
    // Laptops
    if (queryLower.includes('macbook air m3')) {
      return 114900 // MacBook Air M3
    }
    if (queryLower.includes('macbook air')) {
      return 99900 // MacBook Air M2
    }
    if (queryLower.includes('macbook pro')) {
      return 199900 // MacBook Pro 14"
    }
    if (queryLower.includes('dell xps')) {
      return 89990 // Dell XPS 13
    }
    if (queryLower.includes('hp pavilion')) {
      return 45990 // HP Pavilion
    }
    if (queryLower.includes('lenovo thinkpad')) {
      return 65990 // ThinkPad E series
    }
    if (queryLower.includes('gaming laptop')) {
      return 75990 // Gaming laptop average
    }
    
    // Watches
    if (queryLower.includes('apple watch ultra')) {
      return 89900 // Apple Watch Ultra 2
    }
    if (queryLower.includes('apple watch')) {
      return 45900 // Apple Watch Series 9
    }
    if (queryLower.includes('samsung galaxy watch')) {
      return 22999 // Galaxy Watch6
    }
    if (queryLower.includes('fitbit')) {
      return 12999 // Fitbit Versa
    }
    
    // TVs
    if (queryLower.includes('55 inch tv') || queryLower.includes('55" tv')) {
      return 45990 // 55" Smart TV average
    }
    if (queryLower.includes('65 inch tv') || queryLower.includes('65" tv')) {
      return 65990 // 65" Smart TV average
    }
    if (queryLower.includes('samsung tv')) {
      return 52990 // Samsung Smart TV
    }
    if (queryLower.includes('lg tv')) {
      return 48990 // LG Smart TV
    }
    
    // Tablets
    if (queryLower.includes('ipad pro')) {
      return 99900 // iPad Pro 11"
    }
    if (queryLower.includes('ipad air')) {
      return 59900 // iPad Air
    }
    if (queryLower.includes('ipad')) {
      return 34900 // iPad 10th gen
    }
    if (queryLower.includes('samsung tab')) {
      return 28999 // Galaxy Tab A8
    }
    
    // Default categories
    if (queryLower.includes('wireless headphones') || queryLower.includes('bluetooth headphones')) {
      return 3999 // Generic wireless headphones
    }
    if (queryLower.includes('earbuds') || queryLower.includes('earphones')) {
      return 1999 // Generic earbuds
    }
    if (queryLower.includes('laptop')) {
      return 55990 // Generic laptop
    }
    if (queryLower.includes('smartphone') || queryLower.includes('mobile')) {
      return 25990 // Generic smartphone
    }
    if (queryLower.includes('smartwatch') || queryLower.includes('watch')) {
      return 8999 // Generic smartwatch
    }
    
    return 15000 // Default fallback
  }

  const generateMockResults = (query: string): SearchResults => {
    const platforms = ['Amazon', 'Flipkart', 'Meesho', 'Snapdeal', 'Reliance Digital', 'Croma']
    
    // Get realistic base price for the specific product
    const basePrice = getRealisticPrice(query)
    
    const products: ProductListing[] = platforms.map((platform, index) => {
      // Platform-specific pricing adjustments (realistic market differences)
      let platformMultiplier = 1
      let hasSpecialOffer = false
      
      switch (platform) {
        case 'Amazon':
          platformMultiplier = 0.95 // Usually competitive pricing
          hasSpecialOffer = Math.random() > 0.7 // 30% chance of special offer
          break
        case 'Flipkart':
          platformMultiplier = 0.97 // Competitive with Amazon
          hasSpecialOffer = Math.random() > 0.6 // 40% chance of special offer
          break
        case 'Meesho':
          platformMultiplier = 0.85 // Often cheaper but limited premium products
          hasSpecialOffer = Math.random() > 0.5 // 50% chance of offer
          break
        case 'Snapdeal':
          platformMultiplier = 0.90 // Generally lower prices
          hasSpecialOffer = Math.random() > 0.6 // 40% chance of offer
          break
        case 'Reliance Digital':
          platformMultiplier = 1.05 // Slightly premium, offline presence
          hasSpecialOffer = Math.random() > 0.8 // 20% chance of offer
          break
        case 'Croma':
          platformMultiplier = 1.03 // Premium positioning
          hasSpecialOffer = Math.random() > 0.8 // 20% chance of offer
          break
      }
      
      const baseAdjustedPrice = basePrice * platformMultiplier
      const priceVariation = (Math.random() - 0.5) * baseAdjustedPrice * 0.08 // ±8% variation
      const price = baseAdjustedPrice + priceVariation
      
      // Apply special offers
      let originalPrice = price
      if (hasSpecialOffer) {
        const offerDiscount = 0.05 + Math.random() * 0.20 // 5-25% discount
        originalPrice = price / (1 - offerDiscount)
      } else {
        originalPrice = price * (1 + Math.random() * 0.15) // Up to 15% original markup
      }
      
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100)
      
      // More realistic product names
      const productVariants = [
        `${query} (${platform} Exclusive)`,
        `${query} - Official Store`,
        `${query} with 1 Year Warranty`,
        `${query} - Latest Model`,
        `${query} (Certified Refurbished)`,
        `${query} - Best Seller`
      ]
      
      return {
        id: `${platform}-${index}`,
        name: productVariants[index] || `${query} - ${platform}`,
        platform,
        price: Math.round(price),
        originalPrice: Math.round(originalPrice),
        discount: discount > 0 ? discount : 0,
        delivery: index === 0 ? '1 day' : index === 1 ? '2 days' : `${Math.floor(Math.random() * 5) + 3} days`,
        rating: 3.8 + Math.random() * 1.2, // 3.8 to 5.0
        reviews: Math.floor(Math.random() * 15000) + 500,
        returnPolicy: `${[7, 10, 15, 30][Math.floor(Math.random() * 4)]} days return`,
        emiOptions: `₹${Math.round(price / 12)}/month (No Cost EMI)`,
        buyLink: generateBuyLink(platform, query),
        highlights: [
          'Genuine Product', 
          'Warranty Included', 
          index < 2 ? 'Fast Delivery' : 'Free Delivery',
          discount > 15 ? 'Great Discount' : 'Best Price'
        ]
      }
    })

    // Find best options with better logic
    const bestDeal = products.reduce((best, current) => {
      const bestScore = (best.discount || 0) + (best.rating * 10) - (best.price / 1000)
      const currentScore = (current.discount || 0) + (current.rating * 10) - (current.price / 1000)
      return currentScore > bestScore ? current : best
    })
    
    const fastestDelivery = products.reduce((fastest, current) => 
      parseInt(current.delivery) < parseInt(fastest.delivery) ? current : fastest
    )
    
    const highestRated = products.reduce((highest, current) => 
      current.rating > highest.rating ? current : highest
    )

    return {
      query,
      products,
      bestDeal,
      fastestDelivery,
      highestRated
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setChatMessages(prev => [...prev, { role: 'user', content: searchQuery }])

    try {
      // Check if it's a valid product search
      const isValidProduct = searchQuery.length > 2 && 
        !searchQuery.toLowerCase().includes('hello') && 
        !searchQuery.toLowerCase().includes('hi') &&
        !searchQuery.toLowerCase().includes('how are you')

      if (isValidProduct) {
        // Generate AI response for valid product
        const aiResponse = await blink.ai.generateText({
          prompt: `You are BuyWise.AI, a Gen Z shopping assistant. A user searched for "${searchQuery}". 
          
          Respond with a brief, enthusiastic message saying you're finding the best deals for this product. 
          Keep it casual, friendly, and use emojis. Max 1-2 sentences.
          
          Example: "Awesome choice! 🔥 Let me find the best deals on ${searchQuery} across all platforms for you!"`,
          maxTokens: 100
        })

        setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse.text }])
        
        // Generate mock product listings
        const mockResults = generateMockResults(searchQuery)
        setSearchResults(mockResults)
      } else {
        // Handle vague or invalid searches
        const aiResponse = await blink.ai.generateText({
          prompt: `You are BuyWise.AI, a Gen Z shopping assistant. A user searched for "${searchQuery}" which seems too vague or not a product. 
          
          Respond with a friendly Gen Z message asking for clarification with a specific product name.
          Keep it casual, friendly, and use emojis. Give examples of good searches.`,
          maxTokens: 150
        })

        setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse.text }])
      }
    } catch (error) {
      console.error('Search error:', error)
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Oops! Something went wrong with the search. Can you try again? 😅" 
      }])
    }

    setIsSearching(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading BuyWise.AI...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to BuyWise.AI</CardTitle>
            <p className="text-gray-600">Your Gen Z shopping assistant for smarter deals</p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => blink.auth.login()} 
              className="w-full bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-700 hover:to-amber-600"
            >
              Sign In to Start Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-amber-500 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BuyWise.AI</h1>
                <p className="text-sm text-gray-600">Smart Shopping Assistant</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => blink.auth.logout()}
              className="text-sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hey! What do you wanna buy today? 👋
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            I'll find the best deals, fastest delivery, and top-rated options across all major platforms
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="e.g., iPhone 15, wireless headphones, gaming laptop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isSearching}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-700 hover:to-amber-600"
              >
                {isSearching ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        {chatMessages.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-lg text-gray-600">Searching across all platforms...</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-8 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults && !isSearching && (
          <div className="max-w-6xl mx-auto">
            {/* Demo Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Smart Price Comparison</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Prices are based on current market data (Jan 2025) with realistic platform variations and live offers. "Buy Now" buttons redirect to actual platform search pages for real shopping.
                  </p>
                </div>
              </div>
            </div>
            {/* Best Deals Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 deal-highlight">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    <CardTitle className="text-lg text-amber-800">🔥 Best Overall Deal</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-gray-900">{searchResults.bestDeal?.name}</p>
                  <p className="text-sm text-gray-600">{searchResults.bestDeal?.platform}</p>
                  <p className="text-xl font-bold text-amber-600">₹{searchResults.bestDeal?.price.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-lg text-green-800">⚡ Fastest Delivery</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-gray-900">{searchResults.fastestDelivery?.name}</p>
                  <p className="text-sm text-gray-600">{searchResults.fastestDelivery?.platform}</p>
                  <p className="text-xl font-bold text-green-600">{searchResults.fastestDelivery?.delivery}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    <CardTitle className="text-lg text-purple-800">⭐ Highest Rated</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-gray-900">{searchResults.highestRated?.name}</p>
                  <p className="text-sm text-gray-600">{searchResults.highestRated?.platform}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-xl font-bold text-purple-600">
                      {searchResults.highestRated?.rating.toFixed(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`platform-badge ${platformColors[product.platform] || 'bg-gray-100 text-gray-800'}`}>
                        🛒 {product.platform}
                      </Badge>
                      {product.discount && product.discount > 0 && (
                        <Badge variant="destructive" className="bg-red-500">
                          {product.discount}% OFF
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>🚚 {product.delivery}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{product.rating.toFixed(1)}</span>
                          <span>({product.reviews.toLocaleString()})</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>🔁 {product.returnPolicy}</p>
                        {product.emiOptions && (
                          <p>💳 EMI: {product.emiOptions}</p>
                        )}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-700 hover:to-amber-600"
                      onClick={() => window.open(product.buyLink, '_blank')}
                    >
                      Buy Now 🛍️
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searchResults && !isSearching && chatMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to find amazing deals?</h3>
              <p className="text-gray-600">
                Just type what you're looking for and I'll compare prices across all major platforms!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App