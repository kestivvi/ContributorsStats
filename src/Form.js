import './Form.css'
import { map } from 'lodash'
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Form({ chartTypes, onClick }) {

	let option_list = map(chartTypes, (type) => <option key={type} value={type}>{type}</option>)

	let formik = useFormik({
		initialValues: {
			APItoken: '',
			owner: '',
			repo: '',
			startDate: '',
			endDate: '',
			chartType: chartTypes[0],
		},
		validationSchema: Yup.object({
			APItoken: Yup.string().required('GitHub API Token must be provided!'),
			owner: Yup.string().required('Owner of repository must be provided!'),
			repo: Yup.string().required('Repository of owner must be provided!'),
			startDate: Yup.date().required('Start date must be provided!').max(Yup.ref('endDate'), 'Start date must be before end date!'),
			endDate: Yup.date().required('End date must be provided!').min(Yup.ref('startDate'), 'End date must be after start date!'),
		}),
		onSubmit: (values) => {
			// console.log(values);
			onClick(values)
		}
	});

	return (
		<form onSubmit={formik.handleSubmit} className="Form">
			<div className='item'>
				<label htmlFor="APItoken">GitHub API Token</label>
				{formik.touched.APItoken && formik.errors.APItoken && <div className="errorLabel">{formik.errors.APItoken}</div>}
				<input
					type="text"
					className={formik.touched.APItoken && formik.errors.APItoken ? "errorInput" : ""}
					value={formik.values.APItoken}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					id="APItoken"
				/>
			</div>

			<div className='item'>
				<label htmlFor="owner">Owner</label>
				{formik.touched.owner && formik.errors.owner && <div className="errorLabel">{formik.errors.owner}</div>}
				<input
					type="text"
					className={formik.touched.owner && formik.errors.owner ? "errorInput" : ""}
					value={formik.values.owner}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					id="owner"
				/>
			</div>

			<div className='item'>
				<label htmlFor="repo">Repo</label>
				{formik.touched.repo && formik.errors.repo && <div className="errorLabel">{formik.errors.repo}</div>}
				<input
					type="text"
					className={formik.touched.repo && formik.errors.repo ? "errorInput" : ""}
					value={formik.values.repo}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					id="repo"
				/>
			</div>

			<div className='item'>
				<label htmlFor="startDate">Start Date</label>
				{formik.touched.startDate && formik.errors.startDate && <div className="errorLabel">{formik.errors.startDate}</div>}
				<input
					type="date"
					className={formik.touched.startDate && formik.errors.startDate ? "errorInput" : ""}
					value={formik.values.startDate}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					id="startDate"
				/>
			</div>


			<div className='item'>
				<label htmlFor="endDate">End Date</label>
				{formik.touched.endDate && formik.errors.endDate && <div className="errorLabel">{formik.errors.endDate}</div>}
				<input
					type="date"
					className={formik.touched.endDate && formik.errors.APItoken ? "errorInput" : ""}
					value={formik.values.endDate}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					id="endDate"
				/>
			</div>

			<div className='item'>
				<label htmlFor="chartType">Chart Type</label>
				{formik.touched.chartType && formik.errors.chartType && <div className="errorLabel">{formik.errors.chartType}</div>}
				{formik.touched.chartType && formik.errors.chartType && <div className="errorLabel">{formik.errors.chartType}</div>}
				<select
					value={formik.values.chartType}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					id="chartType">
					{option_list}
				</select>
			</div>

			<button type="submit">Show</button>
		</form>
	)
}

export default Form;
