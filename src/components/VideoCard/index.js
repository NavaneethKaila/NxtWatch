// import {formatDistanceToNow} from 'date-fns'
import {Link} from 'react-router-dom'
import './index.css'

const VideoCard = props => {
  const {videoDetails} = props
  const {
    id,
    title,
    thumbnailUrl,
    channel,
    viewCount,
    publishedAt,
  } = videoDetails
  const {profileImageUrl, name} = channel

  return (
    <Link to={`/videos/${id}`} className="link-item video-card-list-item">
      <li className="video-card-list-item">
        <img src={thumbnailUrl} alt={title} className="thumbnail" />
        <div className="card-content-container">
          <img src={profileImageUrl} alt={name} className="profile-image" />
          <div>
            <h1 className="title">{title}</h1>
            <p className="name">{name}</p>
            <div className="views-time-container">
              <p className="views">{viewCount} views</p>
              <p>. {publishedAt}</p>
            </div>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default VideoCard
