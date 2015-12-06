#!/usr/bin/python
# -*- coding: utf-8 -*-

# @License EPL-1.0 <http://spdx.org/licenses/EPL-1.0>
##############################################################################
# Copyright (c) 2015 The Linux Foundation and others.
#
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License v1.0
# which accompanies this distribution, and is available at
# http://www.eclipse.org/legal/epl-v10.html
##############################################################################

import os

import pytest

from spectrometer.dashboard import create_dashboard


@pytest.fixture
def app():
    config = os.path.join(os.getcwd(), 'config.py')
    app = create_dashboard(config)
    return app
