import React, {PureComponent} from 'react';
import classNames from 'classnames';
import {getDateString} from '../utils';
import format from 'date-fns/format';
import getDay from 'date-fns/get_day';
import getDaysInMonth from 'date-fns/get_days_in_month';
import isSameYear from 'date-fns/is_same_year';
import styles from './Month.scss';

export default class Month extends PureComponent {
  renderRows() {
    const {
      DayComponent,
      disabledDates,
      disabledDays,
      monthDate,
      locale,
      maxDate,
      minDate,
      rowHeight,
      rows,
      selected,
      showMonthLabels,
      today,
      theme,
      passThrough,
    } = this.props;
    const currentYear = today.getFullYear();
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthShort = format(monthDate, 'MMM', {locale: locale.locale});
    const monthRows = [];
    let day = 0;
    let isDisabled = false;
    let isToday = false;
    let date, days, dow, row;

    // Used for faster comparisons
    const _today = format(today, 'YYYY-MM-DD');
    const _minDate = format(minDate, 'YYYY-MM-DD');
    const _maxDate = format(maxDate, 'YYYY-MM-DD');

		// Oh the things we do in the name of performance...
    for (let i = 0, len = rows.length; i < len; i++) {
      row = rows[i];
      days = [];
      dow = getDay(new Date(year, month, row[0]));

      for (let k = 0, len = row.length; k < len; k++) {
        day = row[k];

        const date = getDateString(year, month, day);
        const daysInMonth = getDaysInMonth(new Date(year, month, 1));
        if (day < 0 || day > daysInMonth) {
          isDisabled = minDate && date < _minDate || maxDate && date > _maxDate;
          days[k] = (
            <DayComponent
              key={`day-${day}`}
              theme={theme}
              isPadding={true}
              isDisabled={isDisabled}
              selected={selected}
              locale={locale}
              day={0}
              date={date}
              month={month}
              year={year}
              {...passThrough.Day}
            />
          );
        } else {
          isToday = (date === _today);

          isDisabled = (
            minDate && date < _minDate ||
            maxDate && date > _maxDate ||
            disabledDays && disabledDays.length && disabledDays.indexOf(dow) !== -1 ||
            disabledDates && disabledDates.length && disabledDates.indexOf(date) !== -1
          );

          days[k] = (
            <DayComponent
              key={`day-${day}`}
              currentYear={currentYear}
              date={date}
              day={day}
              selected={selected}
              isDisabled={isDisabled}
              isToday={isToday}
              locale={locale}
              hideMonthYear={showMonthLabels}
              month={month}
              monthShort={monthShort}
              theme={theme}
              year={year}
              {...passThrough.Day}
            />
          );
        }

        dow += 1;
      }
      monthRows[i] = (
        <ul
          key={`Row-${i}`}
          className={showMonthLabels ?
            classNames(styles['padded-row'], {[styles.partial]: row.length !== 7}) : classNames(styles.row, {[styles.partial]: row.length !== 7})}
          style={{height: rowHeight}}
          role="row"
          aria-label={`Week ${i + 1}`}
        >
          {days}
        </ul>
      );

    }

    return monthRows;
  }

  render() {
    const {
      locale: {locale},
      monthDate,
      today,
      rows,
      rowHeight,
      showOverlay,
      showMonthLabels,
      style,
      theme,
    } = this.props;
    const dateFormat = isSameYear(monthDate, today) ? 'MMMM' : 'MMMM YYYY';

    return (
      <div className={styles.root} style={{...style, lineHeight: `${rowHeight}px`}}>
        {showMonthLabels &&
        <div className={styles.header}>
          {format(monthDate, dateFormat, {locale})}
        </div>
        }
  				<div className={styles.rows}>
  					{this.renderRows()}
  					{showOverlay &&
  						<label
                className={classNames(styles.label, {
                  [styles.partialFirstRow]: rows[0].length !== 7,
                })}
                style={{backgroundColor: theme.overlayColor}}
              >
                <span>{format(monthDate, dateFormat, {locale})}</span>
              </label>
  					}
  				</div>
  			</div>
    );
  }
}
