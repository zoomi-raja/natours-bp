import React from 'react';
import coverPhoto from '../../assets/qudra-lake-cover.jpg';
import svgSprite from '../../assets/icons.svg';
import classes from './Tourdetail.module.scss';
import axios from '../../utils/Axios';
import TourDescription from '../../components/TourDescription/TourDescription';
import TourStats from '../../components/TourStats/TourStats';
import Map from '../../components/Map/Map';
import Reviews from '../../components/Reviews/Reviews';
import Spinner from '../../components/UI/Spinner/Spinner';
class Tourdetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tour: {},
      loading: true,
    };
  }
  async componentDidMount() {
    try {
      const tour = await axios.get(`/tours/${this.props.match.params.id}`);
      this.setState({ tour: tour.data.data.tour, loading: false });
    } catch (err) {
      alert(err.message + ': in tourDetail.js');
    }
  }
  render() {
    let html;
    if (this.state.loading) {
      html = <Spinner style={{ margin: '36vh auto' }} />;
    } else {
      html = (
        <section id="tour-detail">
          <div
            className={classes.detail_cover}
            style={{
              background: `url(${coverPhoto}) no-repeat center center/cover`,
            }}
          ></div>
          <div className={['container', classes.container].join(' ')}>
            <div className={classes['detail-heading']}>
              <h1 className={classes['detail-heading__title']}>
                {this.state.tour.name}
              </h1>
              <div className={classes['detail-heading__info']}>
                <div className={classes['detail-icons']}>
                  <svg className={classes['detail-icons__icon']}>
                    <use xlinkHref={`${svgSprite}#icon-calendar`}></use>
                  </svg>
                  <span>{this.state.tour.duration} days</span>
                </div>
                <div className={classes['detail-icons']}>
                  <svg className={classes['detail-icons__icon']}>
                    <use xlinkHref={`${svgSprite}#icon-location-pin`}></use>
                  </svg>
                  <span>{this.state.tour.startLocation.description}</span>
                </div>
                <div className={classes['detail-icons']}>
                  <svg className={classes['detail-icons__icon']}>
                    <use xlinkHref={`${svgSprite}#icon-user`}></use>
                  </svg>
                  <span>{this.state.tour.maxGroupSize} People</span>
                </div>
              </div>
            </div>
            <div className="bottom-line"></div>
            <TourDescription
              desc={{
                images: this.state.tour.images,
                description: this.state.tour.description,
              }}
            />
            <TourStats
              guides={this.state.tour.guides}
              details={{
                startDate: this.state.tour.startDates,
                difficulty: this.state.tour.difficulty,
                rating: this.state.tour.ratingsAverage,
                price: this.state.tour.price,
              }}
            />
            <Map locations={this.state.tour.locations} />
            <Reviews data={this.state.tour.reviews} />
          </div>
        </section>
      );
    }
    return html;
  }
}
export default Tourdetail;
