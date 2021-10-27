import {Component} from 'react'
import {AiFillHome, AiOutlineSearch} from 'react-icons/ai'
import {HiFire} from 'react-icons/hi'
import {SiYoutubegaming} from 'react-icons/si'
import {MdPlaylistAdd} from 'react-icons/md'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import VideoCard from '../VideoCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    videosData: [],
  }

  componentDidMount() {
    this.getVideosData()
  }

  getFormattedData = data => ({
    id: data.id,
    title: data.title,
    thumbnailUrl: data.thumbnail_url,
    channel: {
      name: data.channel.name,
      profileImageUrl: data.channel.profile_image_url,
    },
    viewCount: data.view_count,
    publishedAt: data.published_at,
  })

  getVideosData = async () => {
    const {searchInput} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/all?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.videos.map(eachVideo =>
        this.getFormattedData(eachVideo),
      )
      this.setState({
        videosData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickSearchButton = () => {
    this.getVideosData()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  renderVideosListView = () => {
    const {videosData} = this.state
    const shouldShowVideosList = videosData.length > 0

    return shouldShowVideosList ? (
      <>
        <ul className="videos-list-container">
          {videosData.map(eachVideo => (
            <VideoCard videoDetails={eachVideo} key={eachVideo.id} />
          ))}
        </ul>
      </>
    ) : (
      <div className="no-videos-found-container">
        <img
          alt="no videos"
          className="no-videos-image"
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
        />
        <h1>No Search results found</h1>
        <p>Try different key words or remove search filter</p>
        <button type="button" onClick={this.onClickRetry}>
          Retry
        </button>
      </div>
    )
  }

  onClickRetry = () => {
    this.getVideosData()
  }

  renderFailureView = () => (
    <>
      <img
        alt=""
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having some trouble to complete your request.</p>
      <p>Please try again.</p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllVideos = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVideosListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div data-testid="home">
        <Header />
        <div className="home-container">
          <div className="categories-container">
            <ul className="categories-list">
              <li className="category">
                <AiFillHome className="icon" />
                <p>Home</p>
              </li>
              <li className="category">
                <HiFire className="icon" />
                <p>Trending</p>
              </li>
              <li className="category">
                <SiYoutubegaming className="icon" />
                <p>Gaming</p>
              </li>
              <li className="category">
                <MdPlaylistAdd className="icon" />
                <p>Saved videos</p>
              </li>
            </ul>
            <div className="contact-us-section">
              <h1 className="contact-us-heading">CONTACT US</h1>
              <ul className="social-media-icons-list">
                <li className="logo-item">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-facebook-logo-img.png"
                    alt="facebook logo"
                    className="logo"
                  />
                </li>
                <li className="logo-item">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-twitter-logo-img.png"
                    alt="twitter logo"
                    className="logo"
                  />
                </li>
                <li className="logo-item">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-linked-in-logo-img.png"
                    alt="linked in logo"
                    className="logo"
                  />
                </li>
              </ul>
              <p>Enjoy! Now to see your channels and recommendations!</p>
            </div>
          </div>
          <div className="right-container">
            <div className="banner-section-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                alt="nxt watch logo"
                className="website-logo-image"
              />
              <p>Buy Nxt Watch Premium prepaid plans with UPI</p>
              <button type="button" className="get-it-now-btn">
                GET IT NOW
              </button>
            </div>
            <div className="total-videos-container">
              <div className="search-input-container">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  value={searchInput}
                  onChange={this.onChangeSearchInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  onClick={this.onClickSearchButton}
                >
                  <AiOutlineSearch size="20" />
                </button>
              </div>
              {this.renderAllVideos()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
