import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Card } from 'antd';
import { getPanelDetails } from '../../redux/action';

const PolicyPage = ({ type }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const panel = useSelector((state) => state?.setting?.panel);
    const theme = useSelector((state) => state?.app?.theme);
    useEffect(() => {
        dispatch(getPanelDetails());
    }, [dispatch]);

    return (
        <React.Fragment>
            <Card bordered={false} title={t(type)}>
                <Typography.Text>
                    {panel ? (
                        <div dangerouslySetInnerHTML={{ __html: panel.policy[type] }} style={{ color: theme ? '#fff' : '#333' }} />
                    ) : (
                        <>No policy found</>
                    )}
                </Typography.Text>
            </Card>
        </React.Fragment>
    );
};

export default PolicyPage;
